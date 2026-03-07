import { Buyer } from 'src/buyers/entities/buyer.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'inquiry' })
export class Inquiry {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Buyer, (buyer) => buyer.inquiries)
    @JoinColumn({ name: 'buyer_id' })
    buyer: Buyer;

    @Column({ name: 'email' })
    email: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product' })
    product: Product;

    @Column({ name: 'frequency' })
    frequency: string;

    @Column({ name: 'quantity' })
    quantity: number;

    @Column({ name: 'price' })
    price: number;

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
