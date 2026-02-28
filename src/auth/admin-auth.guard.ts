import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    // Verify that the token payload has admin role
    if (!user.role || user.role !== 'admin') {
      throw new BusinessException(ErrorCodes.ERR_AC_004, 'Access denied. Admin role required.', 'Auth', AdminAuthGuard.name);
    }

    return user;
  }
}

