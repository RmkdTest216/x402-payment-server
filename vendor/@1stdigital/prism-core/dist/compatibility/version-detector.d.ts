/**
 * Protocol Version Detection
 *
 * Automatically detects x402 protocol version from payloads
 */
/**
 * Detect protocol version from a payment payload or response
 *
 * @param payload - Raw payload (object, string, or base64)
 * @returns Protocol version (1 or 2), or null if cannot be determined
 */
export declare function detectProtocolVersion(payload: unknown): 1 | 2 | null;
/**
 * Check if a payload is v1 protocol
 */
export declare function isV1Payload(payload: unknown): boolean;
/**
 * Check if a payload is v2 protocol
 */
export declare function isV2Payload(payload: unknown): boolean;
/**
 * Validate protocol version number
 */
export declare function isValidProtocolVersion(version: unknown): version is 1 | 2;
/**
 * Get default protocol version (v2)
 */
export declare function getDefaultProtocolVersion(): 2;
//# sourceMappingURL=version-detector.d.ts.map