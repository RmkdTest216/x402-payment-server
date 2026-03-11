"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismValidationError = exports.PrismPaymentError = exports.PrismConfigError = exports.PrismNetworkError = exports.PrismGatewayError = exports.PrismError = void 0;
/**
 * Base error class for all Prism SDK errors
 */
class PrismError extends Error {
    constructor(message, code, statusCode, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'PrismError';
        // Maintain proper stack trace (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    /**
     * Convert error to JSON for API responses
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            details: this.details
        };
    }
}
exports.PrismError = PrismError;
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
class PrismGatewayError extends PrismError {
    constructor(message, statusCode, traceId, timestamp, details) {
        super(message, 'GATEWAY_ERROR', statusCode, details);
        this.traceId = traceId;
        this.timestamp = timestamp;
        this.name = 'PrismGatewayError';
    }
    toJSON() {
        return {
            ...super.toJSON(),
            traceId: this.traceId,
            timestamp: this.timestamp
        };
    }
}
exports.PrismGatewayError = PrismGatewayError;
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
class PrismNetworkError extends PrismError {
    constructor(message, originalError) {
        super(message, 'NETWORK_ERROR', 503, originalError);
        this.originalError = originalError;
        this.name = 'PrismNetworkError';
    }
}
exports.PrismNetworkError = PrismNetworkError;
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
class PrismConfigError extends PrismError {
    constructor(message, details) {
        super(message, 'CONFIG_ERROR', 500, details);
        this.name = 'PrismConfigError';
    }
}
exports.PrismConfigError = PrismConfigError;
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
class PrismPaymentError extends PrismError {
    constructor(message, details) {
        super(message, 'PAYMENT_ERROR', 402, details);
        this.name = 'PrismPaymentError';
    }
}
exports.PrismPaymentError = PrismPaymentError;
/**
 * Validation error (invalid request data)
 */
class PrismValidationError extends PrismError {
    constructor(message, field, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.field = field;
        this.name = 'PrismValidationError';
    }
    toJSON() {
        return {
            ...super.toJSON(),
            field: this.field
        };
    }
}
exports.PrismValidationError = PrismValidationError;
//# sourceMappingURL=errors.js.map