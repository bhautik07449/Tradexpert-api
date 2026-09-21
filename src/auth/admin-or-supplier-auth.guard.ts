import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminOrSupplierAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const supplierIdHeader = request.headers['x-supplier-id'] || request.headers['supplier_id'];
      if (supplierIdHeader) {
        request.user = {
          supplierId: Number(supplierIdHeader),
          role: 'supplier',
        };
        return true;
      }
      // If no auth token or header provided, allow public read or handle inside controller
      return true;
    }

    const token = authHeader.substring(7);
    try {
      const decoded = this.jwtService.decode(token) as any;
      if (decoded) {
        if (decoded.role === 'service' || decoded.role === 'service_partner') {
          return false;
        }
        if (decoded.role === 'super_admin' || decoded.role === 'admin') {
          request.user = {
            userId: decoded.sub,
            email: decoded.email,
            role: 'super_admin',
          };
          return true;
        } else if (decoded.role === 'supplier' || decoded.sub) {
          request.user = {
            supplierId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: 'supplier',
          };
          return true;
        }
      }
    } catch (err) {
      // Decode failed
    }

    return true;
  }
}
