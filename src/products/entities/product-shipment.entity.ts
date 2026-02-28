import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum ProductShipmentStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

@Entity({ name: 'product_shipments' })
export class ProductShipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key' })
  key: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: ProductShipmentStatus,
    default: ProductShipmentStatus.ACTIVE,
  })
  status: ProductShipmentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => Product, product => product.shipments)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
