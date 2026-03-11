"use strict";
/**
 * @1stdigital/prism-core
 * Core library for Prism SDK - Shared types, client, and utilities
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInvalidPaymentResponse = exports.buildInvalidPaymentHeaderResponse = exports.buildErrorResponse = exports.build402Response = exports.findMatchingRoute = exports.parsePrice = exports.PrismMiddlewareCore = exports.PrismValidationError = exports.PrismPaymentError = exports.PrismConfigError = exports.PrismNetworkError = exports.PrismGatewayError = exports.PrismError = exports.PrismClient = void 0;
// Export client
var prism_client_1 = require("./client/prism-client");
Object.defineProperty(exports, "PrismClient", { enumerable: true, get: function () { return prism_client_1.PrismClient; } });
// Export all types (v2 by default, v1 for legacy)
__exportStar(require("./types"), exports);
__exportStar(require("./types/v1"), exports);
__exportStar(require("./types/v2"), exports);
// Export compatibility layer for v1/v2 interop
__exportStar(require("./compatibility"), exports);
// Export error classes for users who want to catch specific types
var errors_1 = require("./types/errors");
Object.defineProperty(exports, "PrismError", { enumerable: true, get: function () { return errors_1.PrismError; } });
Object.defineProperty(exports, "PrismGatewayError", { enumerable: true, get: function () { return errors_1.PrismGatewayError; } });
Object.defineProperty(exports, "PrismNetworkError", { enumerable: true, get: function () { return errors_1.PrismNetworkError; } });
Object.defineProperty(exports, "PrismConfigError", { enumerable: true, get: function () { return errors_1.PrismConfigError; } });
Object.defineProperty(exports, "PrismPaymentError", { enumerable: true, get: function () { return errors_1.PrismPaymentError; } });
Object.defineProperty(exports, "PrismValidationError", { enumerable: true, get: function () { return errors_1.PrismValidationError; } });
// Export middleware core
var middleware_1 = require("./middleware");
Object.defineProperty(exports, "PrismMiddlewareCore", { enumerable: true, get: function () { return middleware_1.PrismMiddlewareCore; } });
// Export utility functions
var utils_1 = require("./utils");
Object.defineProperty(exports, "parsePrice", { enumerable: true, get: function () { return utils_1.parsePrice; } });
Object.defineProperty(exports, "findMatchingRoute", { enumerable: true, get: function () { return utils_1.findMatchingRoute; } });
Object.defineProperty(exports, "build402Response", { enumerable: true, get: function () { return utils_1.build402Response; } });
Object.defineProperty(exports, "buildErrorResponse", { enumerable: true, get: function () { return utils_1.buildErrorResponse; } });
Object.defineProperty(exports, "buildInvalidPaymentHeaderResponse", { enumerable: true, get: function () { return utils_1.buildInvalidPaymentHeaderResponse; } });
Object.defineProperty(exports, "buildInvalidPaymentResponse", { enumerable: true, get: function () { return utils_1.buildInvalidPaymentResponse; } });
//# sourceMappingURL=index.js.map