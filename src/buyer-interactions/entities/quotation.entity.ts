import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Measurement } from '../../measurements/entities/measurement.entity';
import { Category } from 'src/categories/entities/category.entity';

export enum QuotationStatus {
  ACTIVE = 'active',
  BLOCK = 'block',
  DELETED = 'deleted',
}

@Entity({ name: 'quotations' })
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name' })
  productName: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: Category;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'about_product', type: 'text' })
  aboutProduct: string;

  @Column()
  image: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Measurement)
  @JoinColumn({ name: 'measurement_id' })
  measurement: Measurement;

  @Column({ type: 'float' })
  price: number;

  @Column({ name: 'currency_id' })
  currencyId: number;

  @Column({ name: 'shipment_terms', type: 'text' })
  shipmentTerms: string;

  @Column({ name: 'payment_terms', nullable: true })
  paymentTerms: string;

  @Column({ name: 'company_certification', nullable: true })
  companyCertification: string;

  @Column({ name: 'product_certification', nullable: true })
  productCertification: string;

  @Column({ name: 'business_email' })
  businessEmail: string;

  @Column({ name: 'valid_to', type: 'date' })
  validTo: Date;

  @Column()
  place: string;

  @Column({
    type: 'enum',
    enum: QuotationStatus,
    default: QuotationStatus.ACTIVE,
  })
  status: QuotationStatus;

  
  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
