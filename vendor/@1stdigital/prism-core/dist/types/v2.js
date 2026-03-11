"use strict";
/**
 * x402 Protocol v2 Type Definitions
 *
 * These are the CURRENT protocol types (v2 is default).
 * These replace and improve upon v1 types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2_HEADERS = void 0;
/**
 * v2 HTTP Headers
 */
exports.V2_HEADERS = {
    /** Server sends payment requirements in this header */
    PAYMENT_REQUIRED: 'PAYMENT-REQUIRED',
    /** Client sends payment payload in this header */
    PAYMENT_SIGNATURE: 'PAYMENT-SIGNATURE',
    /** Server sends settlement response in this header */
    PAYMENT_RESPONSE: 'PAYMENT-RESPONSE',
};
//# sourceMappingURL=v2.js.map