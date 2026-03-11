import { PaymentRequiredResponse } from '../types';
/**
 * Response structure for middleware
 */
export interface MiddlewareResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: any;
}
/**
 * Build 402 Payment Required response
 *
 * @param requirements - Payment requirements from gateway
 * @returns Standard 402 response with headers
 */
export declare function build402Response(requirements: PaymentRequiredResponse): MiddlewareResponse;
/**
 * Build error response based on error type
 *
 * Handles:
 * - PrismGatewayError: Preserves status code, includes traceId
 * - PrismNetworkError: Returns 503 with retry-after
 * - PrismPaymentError: Returns 402 with error details
 * - Generic Error: Returns 500
 *
 * @param error - Error object
 * @param context - Error context ('requirements' or 'payment')
 * @returns Formatted error response
 */
export declare function buildErrorResponse(error: any, context: 'requirements' | 'payment'): MiddlewareResponse;
/**
 * Build invalid payment header response
 */
export declare function buildInvalidPaymentHeaderResponse(): MiddlewareResponse;
/**
 * Build invalid payment response
 */
export declare function buildInvalidPaymentResponse(error?: string): MiddlewareResponse;
//# sourceMappingURL=response-builder.d.ts.map