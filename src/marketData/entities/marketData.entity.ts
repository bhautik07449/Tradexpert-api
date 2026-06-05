import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'marketdata' })
export class MarketData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0, name: 'budget' })
    budget: number;

    @Column({ name: 'budget_range' })
    budget_range: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'sub_category_id' })
    subCategory: Category;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Index()
    @Column({ name: 'country' })
    country: string;

    @Column({
        name: 'stages',
        type: 'jsonb',
    })
    stages: any;

    @Index()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}