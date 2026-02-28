import { Exclude, Expose } from 'class-transformer';

export class BuyerDto {
  @Expose()
  id: number;

  @Expose()
  gender: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password?: string;

  @Expose()
  companyName: string;

  @Expose()
  address: string;

  @Expose()
  photo: string;

  @Expose()
  phone: string;

  @Expose()
  businessType: string;

  @Expose()
  website: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  lastUpdatedAt: Date;
}

