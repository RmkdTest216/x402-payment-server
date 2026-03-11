import { PrismMiddlewareConfig, RoutesConfig, PaymentPayload } from '../types';
/**
 * Result of middleware processing
 */
export interface MiddlewareResult {
    /** Whether middleware handled the request (sent response) */
    handled: boolean;
    /** HTTP status code (if handled) */
    statusCode?: number;
    /** Response headers (if handled) */
    headers?: Record<string, string>;
    /** Response body (if handled) */
    body?: any;
    /** Payment information (if payment verified) */
    paymentInfo?: {
        payment: PaymentPayload;
        payer: string;
        paymentRequirements: any;
    };
}
/**
 * Request data for middleware processing
 */
export interface MiddlewareRequestData {
    /** Request path (e.g., "/api/premium") */
    path: string;
    /** Payment header value (supports both X-PAYMENT and PAYMENT-SIGNATURE) */
    paymentHeader?: string;
    /** Full resource URL */
    resourceUrl: string;
    /** Protocol version (1 or 2, auto-detected if not provided) */
    protocolVersion?: 1 | 2;
}
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
export declare class PrismMiddlewareCore {
    private readonly config;
    private readonly routes;
    private readonly mode;
    private readonly client;
    private readonly debug;
    private readonly defaultProtocolVersion;
    constructor(config: PrismMiddlewareConfig, routes: RoutesConfig);
    /**
     * Handle incoming request
     *
     * @param requestData - Request data (path, payment header, resource URL)
     * @returns Middleware result indicating how to proceed
     */
    handleRequest(requestData: MiddlewareRequestData): Promise<MiddlewareResult>;
    /**
     * Handle request without payment (return 402 with requirements)
     */
    private handleNoPayment;
    /**
     * Handle payment verification
     */
    private handlePaymentVerification;
    /**
     * Decode and parse payment header (supports both v1 and v2, base64 encoded JSON)
     *
     * @param paymentHeader - Base64 encoded payment header
     * @returns Parsed PaymentPayload or null if invalid
     */
    private decodePaymentHeader;
    /**
     * Find the payment requirement that matches the client's payment
     *
     * @param paymentRequirements - Array of accepted payment requirements
     * @param paymentPayload - Payment payload from client (v1 or v2)
     * @param protocolVersion - Protocol version
     * @returns Matching payment requirement or undefined if no match
     */
    private findMatchingPaymentRequirement;
    /**
     * Settlement callback - call this after successful response
     *
     * @param paymentPayload - Payment payload
     * @param paymentRequirements - Payment requirements
     * @param statusCode - Response status code
     * @returns Settlement result with transaction hash if successful
     */
    settlementCallback(paymentPayload: PaymentPayload, paymentRequirements: any, statusCode: number): Promise<{
        success: boolean;
        transaction?: string;
        payer?: string;
        network?: string;
        errorReason?: string;
    } | null>;
}
//# sourceMappingURL=middleware-core.d.ts.map