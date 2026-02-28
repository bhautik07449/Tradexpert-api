import { Expose } from 'class-transformer';
import { AdminDto } from 'src/admin/dto/admin.dto';

export class LoginAdminResultDto extends AdminDto {
  @Expose()
  access_token: string;
}
