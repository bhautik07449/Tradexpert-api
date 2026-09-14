import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { LoginAdminResultDto } from './dto/login-admin-result.dto';
import { plainToClass } from 'class-transformer';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';
import { AdminStatus } from '../admin/entities/admin.entity';

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

    if (admin.status === 'pending') {
      throw new BusinessException(ErrorCodes.ERR_AC_002, 'Your account is pending approval by Master Admin.', 'Auth', AuthService.name, 'loginAdmin');
    }

    if (admin.status === 'block') {
      throw new BusinessException(ErrorCodes.ERR_AC_002, 'Your account has been blocked.', 'Auth', AuthService.name, 'loginAdmin');
    }

    const isPasswordMatching = await bcrypt.compare(loginAdminDto.password, admin.password);
    if (!isPasswordMatching) {
      throw new BusinessException(ErrorCodes.ERR_AC_001, 'Invalid credentials', 'Auth', AuthService.name, 'loginAdmin');
    }

    const payload = { email: admin.email, sub: admin.id, role: admin.role || 'super_admin' };
    const accessToken = this.jwtService.sign(payload);

    await this.adminService.update(admin.id, { status: AdminStatus.ACTIVE });

    const result = plainToClass(LoginAdminResultDto, admin, {
      excludeExtraneousValues: true,
    });
    result.status = AdminStatus.ACTIVE;
    result.access_token = accessToken;

    return result;
  }

  async logoutAdmin(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const decoded: any = this.jwtService.decode(token);
      if (decoded && decoded.sub) {
        await this.adminService.update(decoded.sub, { status: AdminStatus.INACTIVE });
      }
    } catch (error) {
      // Ignore token decode errors
    }
    return { success: true, message: 'Admin logged out successfully' };
  }
}
