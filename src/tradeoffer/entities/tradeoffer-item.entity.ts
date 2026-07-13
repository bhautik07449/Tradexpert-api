import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tradeoffer } from './tradeoffer.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Franchise } from 'src/franchise/entities/franchise.entity';

@Entity({ name: 'tradeoffer_items' })
export class TradeofferItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tradeoffer, (tradeoffer) => tradeoffer.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tradeoffer_id' })
    tradeoffer: Tradeoffer;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'subcategory_id' })
    subCategory: Category;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ nullable: true })
    hsncode: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    quantity: number;

    @Column({ nullable: true })
    unit_measurement: string;

    @Column({ nullable: true })
    packing_configure: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    actual_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discounted_price: number;

    // Dealer Fields
    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: 'franchise_type_id' })
    franchise_type: Franchise;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    video: string;

    @Column({ type: 'text', nullable: true })
    profile: string;

    @Column({ type: 'text', nullable: true })
    financials: string;

    // Tender Fields
    @Column({ nullable: true })
    tender_level: string;

    @Column({ nullable: true })
    govt_private: string;

    @Column({ nullable: true })
    department: string;

    @Column({ nullable: true })
    extra_info: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // Association Fields
    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    association_image: string;

    @Column({ nullable: true })
    company_type: string;

    @Column({ nullable: true })
    opportunity: string;

    @Column({ nullable: true })
    company_name: string;

    @Column({ nullable: true })
    status: string;

    @Column({ type: 'text', nullable: true })
    eoi: string;

    @Column({ type: 'text', nullable: true })
    mou: string;

    @Column({ type: 'text', nullable: true })
    moa: string;

    @Column({ type: 'text', nullable: true })
    mois: string;

    @Column({ type: 'text', nullable: true })
    track_progress: string;
}
