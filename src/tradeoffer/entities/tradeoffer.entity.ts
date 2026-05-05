import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

export enum TradeofferStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'tradeoffer' })
export class Tradeoffer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tradetype)
    @JoinColumn({ name: 'trade_type' })
    trade_type: Tradetype;

    @Column()
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @ManyToMany(() => Category)
    @JoinTable({ name: 'tradeoffer_categories' })
    category: Category[];

    @ManyToMany(() => Category)
    @JoinTable({ name: 'tradeoffer_subcategories' })
    subCategory: Category[];

    @ManyToMany(() => Product)
    @JoinTable({ name: 'tradeoffer_products' })
    product: Product[];

    @Column({
        type: 'enum',
        enum: TradeofferStatus,
        default: TradeofferStatus.ACTIVE
    })
    status: TradeofferStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
