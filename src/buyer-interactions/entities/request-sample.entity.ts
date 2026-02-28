import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';
import { Measurement } from '../../measurements/entities/measurement.entity';

export enum RequestSampleStatus {
  ACTIVE = 'active',
  BLOCK = 'block',
  DELETED = 'deleted',
}

@Entity({ name: 'request_samples' })
export class RequestSample {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Measurement)
  @JoinColumn({ name: 'measurement_id' })
  measurement: Measurement;

  @Column({ name: 'required_latest_price' })
  requiredLatestPrice: number;

  @Column({ name: 'pay_for_sample', default: false })
  payForSample: boolean;

  @Column({ name: 'pay_for_shipment', default: false })
  payForShipment: boolean;

  @Column({
    type: 'enum',
    enum: RequestSampleStatus,
    default: RequestSampleStatus.ACTIVE,
  })
  status: RequestSampleStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => Buyer, buyer => buyer.requestSamples)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => Product, product => product.requestSamples)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
