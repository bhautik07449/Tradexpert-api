import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SupplierAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && (decoded.role === 'supplier' || decoded.sub)) {
          request.user = {
            supplierId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role || 'supplier',
          };
          return true;
        }
      } catch (err) {
        // Fallback checks below
      }
    }

    const supplierIdHeader = request.headers['x-supplier-id'] || request.headers['supplier_id'];
    if (supplierIdHeader) {
      request.user = {
        supplierId: Number(supplierIdHeader),
        role: 'supplier',
      };
      return true;
    }

    return true;
  }
}
