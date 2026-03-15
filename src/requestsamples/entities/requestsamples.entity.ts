import { Buyer } from 'src/buyers/entities/buyer.entity';
import { Product } from 'src/product/entities/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

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

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ default: false })
    ccEmail: boolean;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ nullable: true })
    samples: number;

    @Column({ nullable: true })
    sampleUnit: string;

    @Column({ nullable: true })
    shipmentPay: string;

    @Column({ nullable: true })
    title: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ name: 'business_contact' })
    businessContact: string;

    @Column({ nullable: true })
    company: string;

    @Column()
    email: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    website: string;

    @Column({ name: 'business_type', nullable: true })
    businessType: string;

    @Column({ nullable: true })
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
