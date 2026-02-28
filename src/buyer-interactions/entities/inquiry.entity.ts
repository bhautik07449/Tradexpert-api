import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';
import { Measurement } from '../../measurements/entities/measurement.entity';

export enum InquiryStatus {
  ACTIVE = 'active',
  BLOCK = 'block',
  DELETED = 'deleted',
}

export enum RequirementFrequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly',
}

@Entity({ name: 'inquiries' })
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Buyer, (buyer) => buyer.inquiries)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => Product, (product) => product.inquiries)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Measurement)
  @JoinColumn({ name: 'measurement_id' })
  measurement: Measurement;

  @Column({ name: 'required_latest_price' })
  requiredLatestPrice: number;

  @Column({
    name: 'requirement_frequency',
    type: 'enum',
    enum: RequirementFrequency,
  })
  requirementFrequency: RequirementFrequency;

  @Column({ name: 'preferred_unit_price' })
  preferredUnitPrice: number;

  @Column({ name: 'currency_id' })
  currencyId: number;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.ACTIVE,
  })
  status: InquiryStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}
