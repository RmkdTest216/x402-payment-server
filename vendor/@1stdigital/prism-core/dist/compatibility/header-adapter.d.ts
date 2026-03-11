/**
 * Header Adapter: v1 ↔ v2
 *
 * Handles HTTP header name differences between protocol versions
 * v1: X-PAYMENT, X-PAYMENT-RESPONSE
 * v2: PAYMENT-SIGNATURE, PAYMENT-REQUIRED, PAYMENT-RESPONSE
 */
/**
 * Header names for both protocol versions
 */
export interface HeaderNames {
    /** Header for sending payment payload */
    paymentSignature: string;
    /** Header for sending payment requirements (v2 only) */
    paymentRequired?: string;
    /** Header for sending settlement response */
    paymentResponse: string;
}
/**
 * Get header names for a specific protocol version
 */
export declare function getHeaderNames(version: 1 | 2): HeaderNames;
/**
 * Header Adapter class for reading/writing protocol headers
 */
export declare class HeaderAdapter {
    /**
     * Read payment payload from request headers (supports both v1 and v2)
     *
     * @param getHeader - Function to get header value by name
     * @returns Base64-encoded payment payload, or null if not found
     */
    static getPaymentPayload(getHeader: (name: string) => string | null): string | null;
    /**
     * Set payment payload in request headers
     *
     * @param setHeader - Function to set header value
     * @param payload - Base64-encoded payment payload
     * @param version - Protocol version (defaults to 2)
     */
    static setPaymentPayload(setHeader: (name: string, value: string) => void, payload: string, version?: 1 | 2): void;
    /**
     * Set payment requirements in response headers (v2 only)
     *
     * @param setHeader - Function to set header value
     * @param requirements - Base64-encoded payment requirements
     * @param version - Protocol version
     */
    static setPaymentRequired(setHeader: (name: string, value: string) => void, requirements: string, version?: 1 | 2): void;
    /**
     * Read settlement response from response headers (supports both v1 and v2)
     *
     * @param getHeader - Function to get header value by name
     * @returns Base64-encoded settlement response, or null if not found
     */
    static getSettlementResponse(getHeader: (name: string) => string | null): string | null;
    /**
     * Set settlement response in response headers
     *
     * @param setHeader - Function to set header value
     * @param response - Base64-encoded settlement response
     * @param version - Protocol version (defaults to 2)
     */
    static setSettlementResponse(setHeader: (name: string, value: string) => void, response: string, version?: 1 | 2): void;
    /**
     * Detect protocol version from request headers
     *
     * @param getHeader - Function to get header value by name
     * @returns Protocol version (1 or 2), or null if no payment header found
     */
    static detectVersionFromHeaders(getHeader: (name: string) => string | null): 1 | 2 | null;
    /**
     * Get all possible payment header names (for middleware inspection)
     */
    static getAllPaymentHeaders(): string[];
    /**
     * Get all possible response header names (for middleware inspection)
     */
    static getAllResponseHeaders(): string[];
}
//# sourceMappingURL=header-adapter.d.ts.map