import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Abctype } from 'src/abcType/entities/abctype.entity';

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

    @ManyToMany(() => Product, product => product.abcs)
    @JoinTable({ name: 'abc_products' })
    products: Product[];

    @ManyToOne(() => Abctype, abcType => abcType)
    @JoinColumn({ name: 'abctype_id' })
    abc_type: Abctype;

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
