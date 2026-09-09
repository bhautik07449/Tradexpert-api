import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { AdminRole } from 'src/admin/entities/admin.entity';

export class LoginAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
