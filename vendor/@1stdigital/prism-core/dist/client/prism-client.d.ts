import { AuthInfoResponse, PaymentRequirementsRequest, PaymentRequiredResponse, PaymentRequirements, PaymentPayload, PrismMiddlewareConfig } from '../types';
/**
 * Client for interacting with Prism Gateway API
 */
export declare class PrismClient {
    private client;
    private apiKey;
    private debug;
    private protocolVersion;
    private static readonly DEFAULT_BASE_URL;
    constructor(config: PrismMiddlewareConfig);
    /**
     * Handle Axios errors and convert to structured Prism errors
     */
    private handleError;
    /**
     * Get authentication info for the API key
     */
    getAuthInfo(): Promise<AuthInfoResponse>;
    /**
     * Get payment requirements for a resource (On-demand mode)
     */
    getPaymentRequirements(request: PaymentRequirementsRequest): Promise<PaymentRequiredResponse>;
    /**
     * Verify a payment payload
     * Verifies the cryptographic signature and payment authorization
     *
     * @param paymentPayload - Decoded payment payload from X-PAYMENT header
     * @param paymentRequirements - Payment requirements for validation
     * @returns Verification result with payer address if valid
     */
    verifyPayment(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<{
        isValid: boolean;
        payer?: string;
        error?: string;
    }>;
    /**
     * Settle/execute a payment
     * Submits the signed payment authorization to blockchain via Prism Gateway
     */
    settlePayment(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<{
        success: boolean;
        payer?: string;
        transaction?: string;
        network?: string;
        errorReason?: string;
    }>;
}
//# sourceMappingURL=prism-client.d.ts.map