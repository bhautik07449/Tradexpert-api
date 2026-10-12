import { Buyer } from 'src/buyers/entities/buyer.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'inquiry' })
export class Inquiry {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Buyer, (buyer) => buyer.inquiries)
    @JoinColumn({ name: 'buyer_id' })
    buyer: Buyer;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product' })
    product: Product;

    @Column({ name: 'subject' })
    subject: string;

    @Column({ name: 'message' })
    message: string;

    @Column({ name: 'frequency', nullable: true })
    frequency: string;

    @Column({ name: 'quantity', nullable: true })
    quantity: number;

    @Column({ name: 'price', nullable: true })
    price: number;

    @Column({ name: 'country', nullable: true })
    country: string;

    @Column({ name: 'reason_type', nullable: true })
    reason_type: string;

    @Column({ name: 'category', nullable: true })
    category: string;

    @Column({ name: 'reason_desc', type: 'text', nullable: true })
    reason_desc: string;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number;

    @Column({ name: 'supplier_name', nullable: true })
    supplier_name: string;

    @Column({
        type: 'enum',
        enum: status,
        default: status.ACTIVE,
    })
    status: status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
