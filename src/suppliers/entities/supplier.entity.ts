import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SupplierType {
  MANUFACTURER = 'Manufacturer',
  TRADER = 'Trader',
  AGENT = 'Agent',
}

export enum SupplierStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'firm_name', nullable: true })
  firmName: string;

  // @Column({ name: 'supplier_service_id', nullable: true })
  // supplierServiceId: string;

  @Column({ nullable: true })
  productStatus: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'product_category', type: 'text', nullable: true })
  productCategory: string;

  @Column({ nullable: true })
  products: string;

  @Column({ nullable: true })
  website: string;

  @Column({
    type: 'enum',
    enum: SupplierType,
    nullable: true,
  })
  supplierType: SupplierType;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  status: SupplierStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}

