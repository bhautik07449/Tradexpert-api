import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ name: 'company_name', nullable: true })
  company_name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ name: 'service_type', nullable: true })
  service_type: string;

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

