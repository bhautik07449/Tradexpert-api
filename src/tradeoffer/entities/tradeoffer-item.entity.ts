import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tradeoffer } from './tradeoffer.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

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
}
