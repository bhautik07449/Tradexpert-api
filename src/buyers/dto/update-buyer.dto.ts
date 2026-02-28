import { IsString, IsOptional, IsEnum } from 'class-validator';
import { BuyerStatus, BusinessType, BuyerGender } from '../entities/buyer.entity';

export class UpdateBuyerDto {
  @IsEnum(BuyerGender)
  @IsOptional()
  gender?: BuyerGender;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @IsString()
  @IsOptional()
  website?: string;

  @IsEnum(BuyerStatus)
  @IsOptional()
  status?: BuyerStatus;
}

