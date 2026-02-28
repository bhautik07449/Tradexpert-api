import { Expose } from 'class-transformer';
import { BuyerDto } from './buyer.dto';

export class LoginBuyerResultDto extends BuyerDto {
  @Expose()
  access_token: string;
}

