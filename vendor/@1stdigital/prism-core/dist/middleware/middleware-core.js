"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismMiddlewareCore = void 0;
const prism_client_1 = require("../client/prism-client");
const utils_1 = require("../utils");
const compatibility_1 = require("../compatibility");
/**
 * Core middleware logic for Prism payment processing
 *
 * This class encapsulates all the common middleware logic that is shared
 * across different framework implementations (Express, HTTP, Fastify, etc.)
 *
 * @example
 * ```typescript
 * const core = new PrismMiddlewareCore(
 *   { apiKey: 'test-key' },
 *   { '/api/premium': { price: 0.01 } }
 * );
 *
 * const result = await core.handleRequest({
 *   path: '/api/premium',
 *   paymentHeader: req.headers['x-payment'],
 *   resourceUrl: 'http://localhost/api/premium'
 * });
 *
 * if (result.handled) {
 *   // Send response
 * } else if (result.paymentInfo) {
 *   // Payment verified, continue
 * }
 * ```
 */
class PrismMiddlewareCore {
    constructor(config, routes) {
        this.config = config;
        this.routes = routes;
        this.mode = 'on-demand';
        this.defaultProtocolVersion = 2; // v2 is default
        this.debug = config.debug || false;
        // Use injected client if provided (for testing), otherwise create new one
        this.client = config.client || new prism_client_1.PrismClient(config);
        // Allow configuration to override default protocol version
        if (config.x402Version === 1 || config.x402Version === 2) {
            this.defaultProtocolVersion = config.x402Version;
        }
    }
    /**
     * Handle incoming request
     *
     * @param requestData - Request data (path, payment header, resource URL)
     * @returns Middleware result indicating how to proceed
     */
    async handleRequest(requestData) {
        const { path, paymentHeader, resourceUrl } = requestData;
        // Detect protocol version from payment header or use default
        let protocolVersion = requestData.protocolVersion || this.defaultProtocolVersion;
        if (paymentHeader && !requestData.protocolVersion) {
            const detected = (0, compatibility_1.detectProtocolVersion)(paymentHeader);
            if (detected) {
                protocolVersion = detected;
            }
        }
        if (this.debug) {
            console.log('[PrismMiddlewareCore] handleRequest:', {
                path,
                hasPaymentHeader: !!paymentHeader,
                resourceUrl,
                protocolVersion
            });
        }
        // Check if current route matches any configured payment route
        const matchedRoute = (0, utils_1.findMatchingRoute)(path, this.routes);
        if (!matchedRoute) {
            if (this.debug) {
                console.log('[PrismMiddlewareCore] No matching route found, allowing request');
            }
            // Route doesn't require payment, allow request to continue
            return { handled: false };
        }
        if (this.debug) {
            console.log('[PrismMiddlewareCore] Matched route:', matchedRoute);
        }
        const routeConfig = this.routes[matchedRoute];
        // No payment header provided
        if (!paymentHeader) {
            if (this.debug) {
                console.log('[PrismMiddlewareCore] No payment header, returning 402');
            }
            return this.handleNoPayment(routeConfig, resourceUrl, protocolVersion);
        }
        // Payment header provided, verify it
        if (this.debug) {
            console.log('[PrismMiddlewareCore] Payment header present, verifying...');
        }
        return this.handlePaymentVerification(paymentHeader, routeConfig, resourceUrl, protocolVersion);
    }
    /**
     * Handle request without payment (return 402 with requirements)
     */
    async handleNoPayment(routeConfig, resourceUrl, protocolVersion) {
        try {
            let paymentRequirements;
            if (this.mode === 'on-demand') {
                // Call Prism Gateway API for payment requirements
                const price = (0, utils_1.parsePrice)(routeConfig.price);
                if (this.debug) {
                    console.log('[PrismMiddlewareCore] Parsed price:', price, 'from:', routeConfig.price);
                }
                const request = {
                    resourceUrl,
                    requestedAmount: price,
                    description: routeConfig.description || 'Payment required',
                    mimeType: routeConfig.mimeType || 'application/json',
                };
                if (this.debug) {
                    console.log('[PrismMiddlewareCore] Calling getPaymentRequirements with:', request);
                }
                paymentRequirements = await this.client.getPaymentRequirements(request);
            }
            // Ensure payment requirements were generated
            if (!paymentRequirements) {
                throw new Error('Failed to generate payment requirements');
            }
            // Gateway now returns data in the format matching the protocol version
            // No transformation needed since PrismClient uses /api/v{version}/ endpoint
            if (this.debug) {
                console.log('[PrismMiddlewareCore] Returning 402 with requirements (v' + protocolVersion + ')');
            }
            // Return 402 Payment Required
            const response = (0, utils_1.build402Response)(paymentRequirements);
            return {
                handled: true,
                ...response,
            };
        }
        catch (error) {
            console.error('Error generating payment requirements:', error);
            // Build appropriate error response
            const response = (0, utils_1.buildErrorResponse)(error, 'requirements');
            return {
                handled: true,
                ...response,
            };
        }
    }
    /**
     * Handle payment verification
     */
    async handlePaymentVerification(paymentHeader, routeConfig, resourceUrl, protocolVersion) {
        try {
            // Decode and parse payment header (supports both v1 and v2)
            const paymentPayload = this.decodePaymentHeader(paymentHeader);
            if (!paymentPayload) {
                const response = (0, utils_1.buildInvalidPaymentHeaderResponse)();
                return {
                    handled: true,
                    ...response,
                };
            }
            // Detect actual protocol version from payload
            const payloadVersion = (0, compatibility_1.detectProtocolVersion)(paymentPayload);
            if (payloadVersion && payloadVersion !== protocolVersion) {
                if (this.debug) {
                    console.log(`[PrismMiddlewareCore] Protocol version mismatch: expected ${protocolVersion}, got ${payloadVersion}`);
                }
                // Use payload version (client decides)
                protocolVersion = payloadVersion;
            }
            if (this.debug) {
                console.log('[PrismMiddlewareCore] Parsed payment payload (v' + protocolVersion + '):', paymentPayload);
            }
            // Reconstruct payment requirements for verification
            const price = (0, utils_1.parsePrice)(routeConfig.price);
            if (this.debug) {
                console.log('[PrismMiddlewareCore] Reconstructing payment requirements with price:', price);
            }
            const request = {
                resourceUrl,
                requestedAmount: price,
                description: routeConfig.description || 'Payment required',
                mimeType: routeConfig.mimeType || 'application/json',
            };
            // Get payment requirements for verification and settlement
            const paymentRequirementsResponse = await this.client.getPaymentRequirements(request);
            // Find the payment requirement that matches the client's payment
            const paymentRequirements = this.findMatchingPaymentRequirement(paymentRequirementsResponse.accepts, paymentPayload, protocolVersion);
            if (!paymentRequirements) {
                if (this.debug) {
                    console.log('[PrismMiddlewareCore] No matching payment requirement found for payment:', paymentPayload);
                }
                const response = (0, utils_1.buildInvalidPaymentResponse)('No matching payment requirement found for the provided payment');
                return {
                    handled: true,
                    ...response,
                };
            }
            // Verify payment with Gateway
            const verificationResult = await this.client.verifyPayment(paymentPayload, paymentRequirements);
            if (!verificationResult.isValid) {
                if (this.debug) {
                    console.log('[PrismMiddlewareCore] Payment verification failed:', verificationResult.error);
                }
                const response = (0, utils_1.buildInvalidPaymentResponse)(verificationResult.error);
                return {
                    handled: true,
                    ...response,
                };
            }
            if (this.debug) {
                console.log('[PrismMiddlewareCore] Payment verified successfully, payer:', verificationResult.payer);
            }
            // Payment is valid, allow request to continue
            return {
                handled: false,
                paymentInfo: {
                    payment: paymentPayload,
                    payer: verificationResult.payer,
                    paymentRequirements,
                },
            };
        }
        catch (error) {
            console.error('Error processing payment:', error);
            // Build appropriate error response
            const response = (0, utils_1.buildErrorResponse)(error, 'payment');
            return {
                handled: true,
                ...response,
            };
        }
    }
    /**
     * Decode and parse payment header (supports both v1 and v2, base64 encoded JSON)
     *
     * @param paymentHeader - Base64 encoded payment header
     * @returns Parsed PaymentPayload or null if invalid
     */
    decodePaymentHeader(paymentHeader) {
        try {
            // Decode base64 to string, then parse JSON
            const decodedString = Buffer.from(paymentHeader, 'base64').toString('utf-8');
            const paymentPayload = JSON.parse(decodedString);
            return paymentPayload;
        }
        catch (error) {
            if (this.debug) {
                console.log('[PrismMiddlewareCore] Failed to decode/parse payment header:', error.message);
            }
            return null;
        }
    }
    /**
     * Find the payment requirement that matches the client's payment
     *
     * @param paymentRequirements - Array of accepted payment requirements
     * @param paymentPayload - Payment payload from client (v1 or v2)
     * @param protocolVersion - Protocol version
     * @returns Matching payment requirement or undefined if no match
     */
    findMatchingPaymentRequirement(paymentRequirements, paymentPayload, protocolVersion) {
        // Extract scheme, network, asset from payload based on version
        let scheme;
        let network;
        let asset;
        if (protocolVersion === 1) {
            const v1Payload = paymentPayload;
            scheme = v1Payload.scheme;
            network = v1Payload.network;
            asset = undefined; // v1 doesn't have asset in payload
        }
        else {
            const v2Payload = paymentPayload;
            scheme = v2Payload.accepted.scheme;
            network = v2Payload.accepted.network;
            asset = v2Payload.accepted.asset;
        }
        return paymentRequirements.find((req) => {
            const schemeMatch = req.scheme === scheme;
            const networkMatch = req.network === network;
            const assetMatch = !asset || req.asset === asset;
            return schemeMatch && networkMatch && assetMatch;
        });
    }
    /**
     * Settlement callback - call this after successful response
     *
     * @param paymentPayload - Payment payload
     * @param paymentRequirements - Payment requirements
     * @param statusCode - Response status code
     * @returns Settlement result with transaction hash if successful
     */
    async settlementCallback(paymentPayload, paymentRequirements, statusCode) {
        // Only settle if response was successful (< 400)
        if (statusCode >= 400) {
            return null;
        }
        try {
            const settlementResult = await this.client.settlePayment(paymentPayload, paymentRequirements);
            if (settlementResult.success && settlementResult.transaction) {
                console.log(`Payment settled: ${settlementResult.transaction} on ${settlementResult.network || 'unknown'} by ${settlementResult.payer}`);
            }
            else if (settlementResult.errorReason) {
                console.error('Settlement failed:', settlementResult.errorReason);
            }
            return settlementResult;
        }
        catch (error) {
            console.error('Error during settlement:', error);
            return null;
        }
    }
}
exports.PrismMiddlewareCore = PrismMiddlewareCore;
//# sourceMappingURL=middleware-core.js.map