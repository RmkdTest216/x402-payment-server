/**
 * Prism x402 Payment Protocol Types
 *
 * NOTE: These types are being migrated to v2 protocol.
 * - v2 types (new, default): ./v2.ts
 * - v1 types (legacy, deprecated): ./v1.ts
 *
 * Current types in this file follow v1 schema and will be updated to v2.
 */
export type * from './v2';
export type * from './v1';
/**
 * @deprecated Use PaymentRequirements from v2.ts instead
 * Payment requirement configuration following x402 spec v1
 */
export interface PaymentRequirementsLegacy {
    scheme: string;
    network: string;
    maxAmountRequired: string;
    resource: string;
    description: string;
    mimeType: string;
    outputSchema?: object | null;
    payTo: string;
    maxTimeoutSeconds: number;
    asset: string;
    extra: object | null;
}
/**
 * Configuration options for Prism middleware
 */
export interface PrismMiddlewareConfig {
    apiKey: string;
    baseUrl?: string;
    debug?: boolean;
    x402Version?: 1 | 2;
    client?: any;
}
/**
 * INTERNAL: Configuration mode for payment requirements generation
 * Not exposed in public API - used internally to switch between implementation modes
 *
 * Modes:
 * - 'on-demand': Calls Prism Gateway API to generate payment requirements dynamically (IMPLEMENTED)
 * - 'cloud': Loads static config from cloud-hosted URL (TODO: Future implementation)
 * - 'file': Loads static config from local file (TODO: Future implementation)
 */
export type ConfigurationMode = 'on-demand' | 'cloud' | 'file';
/**
 * INTERNAL: Extended config with mode (not exposed to users)
 */
export interface InternalMiddlewareConfig extends PrismMiddlewareConfig {
    mode: ConfigurationMode;
    cloudConfigUrl?: string;
    configFilePath?: string;
}
/**
 * Route-specific payment configuration
 */
export interface RoutePaymentConfig {
    price: number | string;
    description?: string;
    mimeType?: string;
    maxTimeoutSeconds?: number;
    resource?: string;
}
/**
 * Routes configuration map
 * Key: route pattern (e.g., '/api/premium', '/weather')
 * Value: payment configuration for that route
 */
export type RoutesConfig = {
    [route: string]: RoutePaymentConfig;
};
/**
 * Auth info response from Prism Gateway
 */
export interface AuthInfoResponse {
    timestamp: string;
    clientId: string;
    clientName: string;
    pointOfServiceId: string;
    scopes: string[];
}
/**
 * Payment requirements request to Prism Gateway
 */
export interface PaymentRequirementsRequest {
    resourceUrl: string;
    requestedAmount: number;
    description: string;
    mimeType: string;
}
/**
 * Downloaded/Cloud config file structure (for future implementation)
 */
export interface PrismStaticConfig {
    x402Version: number;
    updatedAt: string;
    accepted: Array<{
        scheme: string;
        network: string;
        payTo: string;
        maxTimeoutSeconds: number;
        asset: string;
        extra: object | null;
    }>;
}
/**
 * Standard error response format
 */
export interface PrismErrorResponse {
    x402Version: number;
    error: string;
    details?: string;
    gateway?: {
        traceId?: string;
        timestamp?: string;
    };
    retryAfter?: number;
}
//# sourceMappingURL=index.d.ts.map