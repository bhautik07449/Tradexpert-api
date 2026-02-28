import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum ProductCommercialAspectStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

@Entity({ name: 'product_commercial_aspects' })
export class ProductCommercialAspect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key' })
  key: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: ProductCommercialAspectStatus,
    default: ProductCommercialAspectStatus.ACTIVE,
  })
  status: ProductCommercialAspectStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => Product, product => product.commercialAspects)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
