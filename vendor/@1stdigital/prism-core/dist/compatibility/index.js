"use strict";
/**
 * x402 Protocol Compatibility Layer
 *
 * Provides header name compatibility between v1 and v2 protocol versions.
 *
 * @module compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultProtocolVersion = exports.isValidProtocolVersion = exports.isV2Payload = exports.isV1Payload = exports.detectProtocolVersion = exports.getHeaderNames = exports.HeaderAdapter = void 0;
// Header adapters (used by framework middleware packages)
var header_adapter_1 = require("./header-adapter");
Object.defineProperty(exports, "HeaderAdapter", { enumerable: true, get: function () { return header_adapter_1.HeaderAdapter; } });
Object.defineProperty(exports, "getHeaderNames", { enumerable: true, get: function () { return header_adapter_1.getHeaderNames; } });
// Protocol version detection (used internally)
var version_detector_1 = require("./version-detector");
Object.defineProperty(exports, "detectProtocolVersion", { enumerable: true, get: function () { return version_detector_1.detectProtocolVersion; } });
Object.defineProperty(exports, "isV1Payload", { enumerable: true, get: function () { return version_detector_1.isV1Payload; } });
Object.defineProperty(exports, "isV2Payload", { enumerable: true, get: function () { return version_detector_1.isV2Payload; } });
Object.defineProperty(exports, "isValidProtocolVersion", { enumerable: true, get: function () { return version_detector_1.isValidProtocolVersion; } });
Object.defineProperty(exports, "getDefaultProtocolVersion", { enumerable: true, get: function () { return version_detector_1.getDefaultProtocolVersion; } });
//# sourceMappingURL=index.js.map