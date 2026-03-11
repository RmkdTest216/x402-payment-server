import { Request, Response, NextFunction } from 'express';
import { PrismMiddlewareConfig, RoutesConfig } from '@1stdigital/prism-core';
/**
 * Create Prism payment middleware for Express
 *
 * @param config - Prism middleware configuration
 * @param routes - Routes configuration with payment requirements
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * app.use(prismPaymentMiddleware(
 *   {
 *     apiKey: 'dev-key-123'
 *   },
 *   {
 *     '/api/premium': {
 *       price: 0.01,
 *       description: 'Premium API access'
 *     },
 *     '/weather': {
 *       price: '$0.001',
 *       description: 'Weather data'
 *     }
 *   }
 * ));
 * ```
 */
export declare function prismPaymentMiddleware(config: PrismMiddlewareConfig, routes: RoutesConfig): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=prism-middleware.d.ts.map