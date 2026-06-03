import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Abc } from 'src/abc/entities/abc.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, UpdateDateColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { DMR } from 'src/drm/entities/dmr.entity';
import { Countryproduct } from 'src/countryproduct/entities/countryproduct.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';

export enum status {
    INDENTING = 'Indenting',
    ONBEHALF = 'On-behalf',
    MARKETDEVELOPMENT = 'Market-Development',
}

@Entity('product')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: string;

    @ManyToOne(() => Measurement)
    @JoinColumn({ name: 'measure' })
    measure: Measurement;

    @Column()
    teriff: string;

    @Column()
    slug: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'subcategory' })
    subcategory: Category;

    @Column({ default: true })
    newArrival: boolean;

    @Column({ default: false })
    trending: boolean;

    @Column({ default: false })
    featured: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    policy: string;

    @Column()
    seasonalChart: string;

    @Column()
    pageTitle: string;

    @Column()
    metaKeywords: string;

    @Column()
    metaDescription: string;

    @Column({ type: 'json', nullable: true })
    shipmentmanual: { key: string; value: string }[];

    @Column({ type: 'json', nullable: true })
    technicalSpecification: { key: string; value: string }[];

    @Column({ type: 'json', nullable: true })
    commercialAspect: { key: string; value: string }[];

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ nullable: true })
    certification: string

    @Column({ nullable: true })
    application: string;

    @Column({ name: 'country', nullable: true })
    country: string;

    @ManyToOne(() => Tradetype)
    @JoinColumn({ name: 'offer_type'})
    offer_type: Tradetype;

    @Column({
        type: 'enum',
        enum: status,
        default: status.INDENTING,
    })
    status: status;

    @ManyToMany(() => Abc, abc => abc.products)
    abcs: Abc[];

    @ManyToMany(() => Countryproduct, countryproduct => countryproduct.products)
    countryproducts: Countryproduct[];

    @OneToMany(() => DMR, (dmr) => dmr.product)
    dmrs: DMR[];

    @Column({ nullable: true })
    season: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}