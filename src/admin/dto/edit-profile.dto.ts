import { IsString, IsOptional } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

