import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Countryproductname } from 'src/countryproductname/entities/countryproductname.entity';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'countryproduct' })
export class Countryproduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.countryproducts)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Category, category => category.countryproductSubcategory)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Category;

    @ManyToMany(() => Product, product => product.countryproducts)
    @JoinTable({ name: 'countryproducts_products' })
    products: Product[];

    @ManyToOne(() => Countryproductname, productname => productname)
    @JoinColumn({ name: 'productname_id' })
    productname: Countryproductname;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: Status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
