/**
 * Base error class for all Prism SDK errors
 */
export declare class PrismError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly details?: any | undefined;
    constructor(message: string, code: string, statusCode: number, details?: any | undefined);
    /**
     * Convert error to JSON for API responses
     */
    toJSON(): {
        name: string;
        message: string;
        code: string;
        statusCode: number;
        details: any;
    };
}
/**
 * Gateway returned an error (4xx, 5xx from Prism Gateway API)
 *
 * @example
 * ```typescript
 * if (error instanceof PrismGatewayError) {
 *   console.log(`Gateway error: ${error.traceId}`);
 *   // Escalate to backend team if 500
 * }
 * ```
 */
export declare class PrismGatewayError extends PrismError {
    readonly traceId?: string | undefined;
    readonly timestamp?: string | undefined;
    constructor(message: string, statusCode: number, traceId?: string | undefined, timestamp?: string | undefined, details?: any);
    toJSON(): {
        traceId: string | undefined;
        timestamp: string | undefined;
        name: string;
        message: string;
        code: string;
        statusCode: number;
        details: any;
    };
}
/**
 * Network/timeout issues (connection refused, DNS errors, timeout)
 *
 * @example
 * ```typescript
 * if (error instanceof PrismNetworkError) {
 *   // Retry or show "service unavailable" message
 * }
 * ```
 */
export declare class PrismNetworkError extends PrismError {
    readonly originalError: any;
    constructor(message: string, originalError: any);
}
/**
 * Invalid configuration (missing API key, invalid base URL, etc.)
 *
 * @example
 * ```typescript
 * if (error instanceof PrismConfigError) {
 *   // Developer error - check configuration
 * }
 * ```
 */
export declare class PrismConfigError extends PrismError {
    constructor(message: string, details?: any);
}
/**
 * Invalid payment header/payload
 *
 * @example
 * ```typescript
 * if (error instanceof PrismPaymentError) {
 *   // Invalid payment from client
 *   return res.status(402).json({ error: error.message });
 * }
 * ```
 */
export declare class PrismPaymentError extends PrismError {
    constructor(message: string, details?: any);
}
/**
 * Validation error (invalid request data)
 */
export declare class PrismValidationError extends PrismError {
    readonly field?: string | undefined;
    constructor(message: string, field?: string | undefined, details?: any);
    toJSON(): {
        field: string | undefined;
        name: string;
        message: string;
        code: string;
        statusCode: number;
        details: any;
    };
}
//# sourceMappingURL=errors.d.ts.map