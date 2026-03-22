import { Category } from 'src/categories/entities/category.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'quotation' })
export class Quotation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productName: string;

    @Column()
    businessEmail: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    company: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'sub_category_id' })
    subCategory: Category;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'child_category_id' })
    childCategory: Category;

    @Column({ nullable: true })
    quantity: string;

    @ManyToOne(() => Measurement, { nullable: true })
    @JoinColumn({ name: 'unit_id' })
    unit: Measurement;

    @Column({ nullable: true })
    price: string;

    @ManyToOne(() => Currency, { nullable: true })
    @JoinColumn({ name: 'currency_id' })
    currency: Currency;

    @Column({ type: 'date', nullable: true })
    validTo: Date;

    @Column({ nullable: true })
    validityDays: string;

    @Column({ nullable: true })
    shipmentTerm: string;

    @Column({ nullable: true })
    paymentTerm: string;

    @Column({ nullable: true })
    companyCert: string;

    @Column({ nullable: true })
    productCert: string;

    @Column({ type: 'text', nullable: true })
    aboutProduct: string;

    @Column({ nullable: true })
    productImage: string;

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