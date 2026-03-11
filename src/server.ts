import express, { Request, Response, NextFunction } from "express";
import { PrismClient } from "@1stdigital/prism-core";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

const PORT            = Number(process.env.PORT || 3000);
const WALLET_ADDRESS  = process.env.WALLET_ADDRESS as `0x${string}`;
const PRISM_API_KEY   = process.env.PRISM_API_KEY!;
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://prism-gw.fd.xyz";
const PRICE           = process.env.PRICE || "$0.01";

if (!WALLET_ADDRESS) { console.error("❌ Missing WALLET_ADDRESS"); process.exit(1); }
if (!PRISM_API_KEY)  { console.error("❌ Missing PRISM_API_KEY");  process.exit(1); }

const parsedPrice = parseFloat(PRICE.replace("$", ""));

// ── Prism client ───────────────────────────────────────────────────────────────
const prism = new PrismClient({
  apiKey:      PRISM_API_KEY,
  baseUrl:     FACILITATOR_URL,
  x402Version: 2,
  debug:       true,   // ← verbose logging so Railway deploy logs show exact error
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Find the payment requirement whose scheme/network/asset matches what the
 * client actually paid with.  Falls back to the first entry if no match.
 */
function findMatchingRequirement(accepts: any[], payload: any): any {
  if (!Array.isArray(accepts) || accepts.length === 0) return undefined;

  // v2 payload carries the accepted option the client chose
  const chosen = payload?.accepted;
  if (!chosen) return accepts[0];

  return (
    accepts.find(
      (r: any) =>
        r.scheme  === chosen.scheme  &&
        r.network === chosen.network &&
        (!chosen.asset || r.asset === chosen.asset),
    ) ?? accepts[0]
  );
}

// ── Payment middleware ─────────────────────────────────────────────────────────

/**
 * SDK Bug workaround:
 *   prism-express's build402Response() puts raw JSON in the
 *   X-PAYMENT-REQUIREMENTS header, which Node.js rejects (ERR_INVALID_CHAR).
 *   We skip that middleware entirely and speak x402 v2 directly here.
 */
function x402Guard(description: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resourceUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // Support v2 header name (PAYMENT-SIGNATURE) and v1 fallback (X-PAYMENT)
    const paymentHeader =
      req.header("PAYMENT-SIGNATURE") ||
      req.header("X-PAYMENT")         ||
      null;

    // ── 1. Fetch payment requirements from Prism ───────────────────────────
    let requirements: any;
    try {
      requirements = await prism.getPaymentRequirements({
        resourceUrl,
        requestedAmount: parsedPrice,
        description,
        mimeType: "application/json",
      });
    } catch (err: any) {
      console.error("[x402Guard] getPaymentRequirements failed:", {
        message:    err.message,
        statusCode: err.statusCode,
        details:    err.details,
        stack:      err.stack?.split("\n")[0],
      });
      res.status(502).json({
        error:      "Could not reach Prism Gateway",
        details:    err.message,
        statusCode: err.statusCode,
      });
      return;
    }

    // ── 2. No payment header → return 402 with requirements as JSON body ───
    if (!paymentHeader) {
      res.status(402).json(requirements);
      return;
    }

    // ── 3. Decode payment payload (base64-encoded JSON) ────────────────────
    let paymentPayload: any;
    try {
      paymentPayload = JSON.parse(Buffer.from(paymentHeader, "base64").toString("utf8"));
    } catch {
      res.status(402).json({ x402Version: 2, error: "Invalid payment header — must be base64-encoded JSON" });
      return;
    }

    // Find the single matching requirement the client paid against
    const matchedReq = findMatchingRequirement(requirements.accepts, paymentPayload);

    // ── 4. Verify with Prism ───────────────────────────────────────────────
    try {
      const verify = await prism.verifyPayment(paymentPayload, matchedReq);
      if (!verify.isValid) {
        res.status(402).json({ x402Version: 2, error: verify.error || "Payment invalid" });
        return;
      }
    } catch (err: any) {
      res.status(402).json({ x402Version: 2, error: err.message || "Verification failed" });
      return;
    }

    // ── 5. Intercept res.end() → settle BEFORE the body is flushed ─────────
    const originalEnd = res.end.bind(res);
    let settled = false;

    (res as any).end = async function (chunk?: any, encoding?: any, cb?: any) {
      if (settled) return originalEnd(chunk, encoding, cb);
      settled = true;

      if (res.statusCode < 400) {
        try {
          const settle = await prism.settlePayment(paymentPayload, matchedReq);
          if (settle.success && settle.transaction && !res.headersSent) {
            // Use base64 so the header value is always ASCII-safe
            res.setHeader(
              "PAYMENT-RESPONSE",
              Buffer.from(JSON.stringify(settle)).toString("base64"),
            );
          }
          if (!settle.success) {
            return originalEnd(
              JSON.stringify({ x402Version: 2, error: settle.errorReason || "Settlement failed" }),
              "utf8",
              cb,
            );
          }
        } catch (e) {
          console.error("Settlement error:", e);
        }
      }

      return originalEnd(chunk, encoding, cb);
    };

    next();
  };
}

// ── Routes ─────────────────────────────────────────────────────────────────────

app.get(
  "/api/x402/test",
  x402Guard("QA Test Endpoint for X402"),
  (_req, res) => {
    res.json({
      message:   "✅ Payment verified — welcome to the premium endpoint!",
      timestamp: new Date().toISOString(),
      payTo:     WALLET_ADDRESS,
    });
  },
);

app.get("/", (_req, res) => {
  res.json({
    name:      "x402 Payment Server v2 (Prism)",
    status:    "running",
    endpoints: {
      protected: `GET /api/x402/test  (requires ${PRICE} via Prism)`,
      health:    "GET /health",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", payTo: WALLET_ADDRESS, facilitator: FACILITATOR_URL });
});

app.listen(PORT, () => {
  console.log(`\n🚀 x402 Payment Server (v2) on port ${PORT}`);
  console.log(`   Pay-to     : ${WALLET_ADDRESS}`);
  console.log(`   Price      : ${PRICE} per request`);
  console.log(`   Facilitator: ${FACILITATOR_URL}`);
  console.log(`   Prism Key  : ${PRISM_API_KEY.slice(0, 8)}... ✓\n`);
});
