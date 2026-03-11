"use strict";
/**
 * x402 Protocol v1 Type Definitions
 *
 * These types represent the LEGACY v1 protocol structure.
 * New code should use v2 types from ./index.ts
 *
 * @deprecated Use v2 types instead. v1 support will be removed in v2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1_HEADERS = void 0;
/**
 * v1 HTTP Headers
 */
exports.V1_HEADERS = {
    /** Client sends payment payload in this header */
    PAYMENT: 'X-PAYMENT',
    /** Server sends settlement response in this header */
    PAYMENT_RESPONSE: 'X-PAYMENT-RESPONSE',
};
//# sourceMappingURL=v1.js.map