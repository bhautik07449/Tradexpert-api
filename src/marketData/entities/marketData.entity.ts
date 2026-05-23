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
} from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'marketdata' })
export class MarketData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'budget' })
    budget: string;

    @Column({ name: 'budget_range' })
    budget_range: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category_id: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'sub_category_id' })
    sub_category_id: Category;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product_id: Product;

    @Column({ name: 'country' })
    country: string;

    @Column({
        name: 'stages',
        type: 'jsonb',
    })
    stages: any;

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