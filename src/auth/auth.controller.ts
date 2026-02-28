import { Controller, Post, Body, Request } from '@nestjs/common';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto, @Request() request: any) {
    // Check if user is already logged in
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.verify(token);
        if (payload) {
          throw new BusinessException(ErrorCodes.ERR_AC_003, 'You are already logged in', 'Auth', AuthController.name, 'loginAdmin');
        }
      } catch (error) {
        if (error instanceof BusinessException) {
          throw error;
        }
        // Token is invalid or expired - ignore and proceed with login
      }
    }

    return this.authService.loginAdmin(loginAdminDto);
  }
}
