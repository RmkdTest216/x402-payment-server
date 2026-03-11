"use strict";
/**
 * Header Adapter: v1 ↔ v2
 *
 * Handles HTTP header name differences between protocol versions
 * v1: X-PAYMENT, X-PAYMENT-RESPONSE
 * v2: PAYMENT-SIGNATURE, PAYMENT-REQUIRED, PAYMENT-RESPONSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderAdapter = void 0;
exports.getHeaderNames = getHeaderNames;
const v1_1 = require("../types/v1");
const v2_1 = require("../types/v2");
/**
 * Get header names for a specific protocol version
 */
function getHeaderNames(version) {
    if (version === 1) {
        return {
            paymentSignature: v1_1.V1_HEADERS.PAYMENT,
            paymentResponse: v1_1.V1_HEADERS.PAYMENT_RESPONSE,
        };
    }
    else {
        return {
            paymentSignature: v2_1.V2_HEADERS.PAYMENT_SIGNATURE,
            paymentRequired: v2_1.V2_HEADERS.PAYMENT_REQUIRED,
            paymentResponse: v2_1.V2_HEADERS.PAYMENT_RESPONSE,
        };
    }
}
/**
 * Header Adapter class for reading/writing protocol headers
 */
class HeaderAdapter {
    /**
     * Read payment payload from request headers (supports both v1 and v2)
     *
     * @param getHeader - Function to get header value by name
     * @returns Base64-encoded payment payload, or null if not found
     */
    static getPaymentPayload(getHeader) {
        // Try v2 first (default)
        const v2Payload = getHeader(v2_1.V2_HEADERS.PAYMENT_SIGNATURE);
        if (v2Payload) {
            return v2Payload;
        }
        // Fallback to v1
        const v1Payload = getHeader(v1_1.V1_HEADERS.PAYMENT);
        if (v1Payload) {
            return v1Payload;
        }
        return null;
    }
    /**
     * Set payment payload in request headers
     *
     * @param setHeader - Function to set header value
     * @param payload - Base64-encoded payment payload
     * @param version - Protocol version (defaults to 2)
     */
    static setPaymentPayload(setHeader, payload, version = 2) {
        const headerName = version === 2
            ? v2_1.V2_HEADERS.PAYMENT_SIGNATURE
            : v1_1.V1_HEADERS.PAYMENT;
        setHeader(headerName, payload);
    }
    /**
     * Set payment requirements in response headers (v2 only)
     *
     * @param setHeader - Function to set header value
     * @param requirements - Base64-encoded payment requirements
     * @param version - Protocol version
     */
    static setPaymentRequired(setHeader, requirements, version = 2) {
        if (version === 2) {
            setHeader(v2_1.V2_HEADERS.PAYMENT_REQUIRED, requirements);
        }
        // v1 uses response body instead, no header needed
    }
    /**
     * Read settlement response from response headers (supports both v1 and v2)
     *
     * @param getHeader - Function to get header value by name
     * @returns Base64-encoded settlement response, or null if not found
     */
    static getSettlementResponse(getHeader) {
        // Try v2 first (default)
        const v2Response = getHeader(v2_1.V2_HEADERS.PAYMENT_RESPONSE);
        if (v2Response) {
            return v2Response;
        }
        // Fallback to v1
        const v1Response = getHeader(v1_1.V1_HEADERS.PAYMENT_RESPONSE);
        if (v1Response) {
            return v1Response;
        }
        return null;
    }
    /**
     * Set settlement response in response headers
     *
     * @param setHeader - Function to set header value
     * @param response - Base64-encoded settlement response
     * @param version - Protocol version (defaults to 2)
     */
    static setSettlementResponse(setHeader, response, version = 2) {
        const headerName = version === 2
            ? v2_1.V2_HEADERS.PAYMENT_RESPONSE
            : v1_1.V1_HEADERS.PAYMENT_RESPONSE;
        setHeader(headerName, response);
    }
    /**
     * Detect protocol version from request headers
     *
     * @param getHeader - Function to get header value by name
     * @returns Protocol version (1 or 2), or null if no payment header found
     */
    static detectVersionFromHeaders(getHeader) {
        // Check for v2 headers first
        if (getHeader(v2_1.V2_HEADERS.PAYMENT_SIGNATURE)) {
            return 2;
        }
        // Check for v1 headers
        if (getHeader(v1_1.V1_HEADERS.PAYMENT)) {
            return 1;
        }
        return null;
    }
    /**
     * Get all possible payment header names (for middleware inspection)
     */
    static getAllPaymentHeaders() {
        return [
            v2_1.V2_HEADERS.PAYMENT_SIGNATURE,
            v1_1.V1_HEADERS.PAYMENT,
        ];
    }
    /**
     * Get all possible response header names (for middleware inspection)
     */
    static getAllResponseHeaders() {
        return [
            v2_1.V2_HEADERS.PAYMENT_RESPONSE,
            v1_1.V1_HEADERS.PAYMENT_RESPONSE,
            v2_1.V2_HEADERS.PAYMENT_REQUIRED,
        ];
    }
}
exports.HeaderAdapter = HeaderAdapter;
//# sourceMappingURL=header-adapter.js.map