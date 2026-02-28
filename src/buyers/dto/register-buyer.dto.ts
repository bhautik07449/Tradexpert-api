import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { BuyerGender, BusinessType } from '../entities/buyer.entity';

export class RegisterBuyerDto {
  @IsEnum(BuyerGender)
  @IsOptional()
  gender?: BuyerGender;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  phone: string;

  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @IsString()
  @IsOptional()
  website?: string;
}

