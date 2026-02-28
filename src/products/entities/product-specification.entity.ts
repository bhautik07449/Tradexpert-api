import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum ProductSpecificationStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

@Entity({ name: 'product_specifications' })
export class ProductSpecification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key' })
  key: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: ProductSpecificationStatus,
    default: ProductSpecificationStatus.ACTIVE,
  })
  status: ProductSpecificationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => Product, product => product.specifications)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
