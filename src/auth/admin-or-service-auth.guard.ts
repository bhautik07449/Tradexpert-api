import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

@Injectable()
export class AdminOrServiceAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const serviceIdHeader = request.headers['x-service-id'] || request.headers['service_id'];
      if (serviceIdHeader) {
        request.user = {
          serviceId: Number(serviceIdHeader),
          role: 'service',
        };
        return true;
      }
      return true;
    }

    const token = authHeader.substring(7);
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
        if (decoded) {
          if (decoded.role === 'supplier') {
            return false;
          }
          if (decoded.role === 'super_admin' || decoded.role === 'admin') {
            request.user = {
              userId: decoded.sub,
              email: decoded.email,
              role: 'super_admin',
            };
            return true;
          } else if (decoded.role === 'service' || decoded.role === 'service_partner' || decoded.sub) {
            request.user = {
              serviceId: decoded.sub || decoded.id,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role || 'service',
            };
            return true;
          }
        }
      }
    } catch (err) {
      // Decode failed
    }

    return true;
  }
}
