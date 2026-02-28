import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { LoginAdminResultDto } from './dto/login-admin-result.dto';
import { plainToClass } from 'class-transformer';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<LoginAdminResultDto> {
    const admin = await this.adminService.findAdminByEmail(loginAdminDto.email);
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_AC_001, 'Invalid credentials', 'Auth', AuthService.name, 'loginAdmin');
    }
    if (admin.status === 'block') {
      throw new BusinessException(ErrorCodes.ERR_AC_002, 'Your account has been blocked.', 'Auth', AuthService.name, 'loginAdmin');
    }
    const isPasswordMatching = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );
    if (!isPasswordMatching) {
      throw new BusinessException(ErrorCodes.ERR_AC_001, 'Invalid credentials', 'Auth', AuthService.name, 'loginAdmin');
    }
    const payload = { email: admin.email, sub: admin.id, role: 'admin' };
    const accessToken = this.jwtService.sign(payload);

    const result = plainToClass(LoginAdminResultDto, admin, {
      excludeExtraneousValues: true,
    });
    result.access_token = accessToken;

    return result;
  }
}
