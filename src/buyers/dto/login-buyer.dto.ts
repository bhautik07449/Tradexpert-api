import { IsEmail, IsString } from 'class-validator';

export class LoginBuyerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

