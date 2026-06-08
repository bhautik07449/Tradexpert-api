import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  country: string | null;

  @IsEnum(['active', 'block', 'deleted'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  password?: string;
}

