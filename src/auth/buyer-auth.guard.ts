import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';

@Injectable()
export class BuyerAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token');
    }

    // Verify that the token payload has buyer role
    if (!user.role || user.role !== 'buyer') {
      throw new BusinessException(ErrorCodes.ERR_AC_004, 'Access denied. Buyer token required.', 'Auth', BuyerAuthGuard.name);
    }

    return user;
  }
}

