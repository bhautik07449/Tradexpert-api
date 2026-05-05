import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

export enum AbcStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'abc' })
export class Abc {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.abcs)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Category, category => category.abcSubcategories)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Category;

    @ManyToOne(() => Product, product => product.abcs)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({
        type: 'enum',
        enum: AbcStatus,
        default: AbcStatus.ACTIVE
    })
    status: AbcStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
