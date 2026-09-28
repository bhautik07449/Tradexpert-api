import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'supplier_id', nullable: true })
  supplier_id: number;

  @Column({ nullable: true })
  type: string;

  @Column({ name: 'invoice_no', nullable: true })
  invoiceNo: string;

  @Column({ name: 'invoice_date', nullable: true })
  invoiceDate: Date;

  @Column({ name: 'shipping_details', type: 'json', nullable: true })
  shippingDetails: any;

  @Column({ name: 'billing_details', type: 'json', nullable: true })
  billingDetails: any;

  @Column({ name: 'invoice_details', type: 'json', nullable: true })
  invoiceDetails: any;

  @Column({ type: 'json', nullable: true })
  items: any;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ name: 'bank_details', type: 'json', nullable: true })
  bankDetails: any;

  @Column({ name: 'declaration', type: 'text', nullable: true })
  declaration: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}