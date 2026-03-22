import { Inquiry } from 'src/inquiry/entities/inquiry.entity';
import { Requestsamples } from 'src/requestsamples/entities/requestsamples.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum BuyerGender {
  MR = 'Mr',
  MRS = 'Mrs',
}

export enum BuyerStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  BLOCK = 'block',
  DELETED = 'deleted',
}

export enum BusinessType {
  DISTRIBUTOR = 'Distributor',
  RETAILER = 'Retailer',
  MANUFACTURING_AND_PROCESSING = 'Manufacturing and Processing',
  BUYING_HOUSE = 'Buying house',
  TRADING_UNIT = 'Trading unit',
  WAREHOUSING_AND_DISTRIBUTION = 'Warehousing and Distribution',
}

@Entity({ name: 'buyers' })
export class Buyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BuyerGender,
    default: BuyerGender.MR,
  })
  gender: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'activation_code' })
  activationCode: string;

  @Column({ name: 'activation_date' })
  activationDate: Date;

  // @Column({ nullable: true })
  // photo: string;

  @Column()
  phone: string;

  @Column({
    name: 'business_type',
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.DISTRIBUTOR,
  })
  businessType: string;

  @Column({ nullable: true })
  website: string;

  @Column({
    type: 'enum',
    enum: BuyerStatus,
    default: BuyerStatus.ACTIVE,
  })
  status: BuyerStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @OneToMany(() => Inquiry, (inquiry) => inquiry.buyer)
  inquiries: Inquiry[];

  @OneToMany(() => Requestsamples, (requestSample) => requestSample.buyer)
  requestSamples: Requestsamples[];
}

