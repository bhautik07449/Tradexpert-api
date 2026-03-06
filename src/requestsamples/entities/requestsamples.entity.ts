import { Buyer } from 'src/buyers/entities/buyer.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'requestsamples' })
export class Requestsamples {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Buyer, (buyer) => buyer.requestSamples)
    @JoinColumn({ name: 'buyer_id' })
    buyer: Buyer;

    @Column({ name: 'email' })
    email: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product' })
    product: Product;

    @Column({ name: 'quantity' })
    quantity: number;

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
