import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum ProductCertificationStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

@Entity({ name: 'product_certifications' })
export class ProductCertification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProductCertificationStatus,
    default: ProductCertificationStatus.BLOCKED,
  })
  status: ProductCertificationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => Product, product => product.certifications)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
