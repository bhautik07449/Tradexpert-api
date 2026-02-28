import { Exclude, Expose } from 'class-transformer';

export class AdminDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password?: string;

  @Expose()
  photo: string;

  @Expose()
  phone: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  lastUpdatedAt: Date;
}

