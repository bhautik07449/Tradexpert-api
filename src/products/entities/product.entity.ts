import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductApplication } from './product-application.entity';
import { ProductCommercialAspect } from './product-commercial-aspect.entity';
import { ProductCertification } from './product-certification.entity';
import { ProductShipment } from './product-shipment.entity';
import { ProductSpecification } from './product-specification.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Inquiry } from 'src/inquiry/entities/inquiry.entity';
import { Requestsamples } from 'src/requestsamples/entities/requestsamples.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
  EMPTY = '',
}

export enum ProductType {
  INDENTING = 'Indenting',
  ON_BEHALF = 'On-behalf',
  MARKET_DEVELOPMENT = 'Market-Development',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'slug', unique: true })
  slug: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'commercial_info', type: 'text', nullable: true })
  commercialInfo: string;

  @Column({ name: 'seasonal_chart', type: 'text' })
  seasonalChart: string;

  @Column({ name: 'product_specific_policy', type: 'text', nullable: true })
  productSpecificPolicy: string;

  @Column({
    name: 'product_status',
    type: 'enum',
    enum: ProductType,
    nullable: true,
  })
  productType: ProductType;

  @Column({ name: 'general_detail', type: 'text', nullable: true })
  generalDetail: string;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: Category;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'child_category_id' })
  childCategory: Category;

  @Column({ type: 'float' })
  tariff: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ name: 'is_new_arrival', type: 'boolean', default: false })
  isNewArrival: boolean;

  @Column({ name: 'is_trending', type: 'boolean', default: false })
  isTrending: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'page_title', type: 'text', nullable: true })
  pageTitle: string;

  @Column({ name: 'meta_keyword', type: 'text', nullable: true })
  metaKeyword: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
  })
  status: ProductStatus;

  @ManyToOne(() => Brand, brand => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => ProductImage, image => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductApplication, application => application.product)
  applications: ProductApplication[];

  @OneToMany(() => ProductCommercialAspect, aspect => aspect.product)
  commercialAspects: ProductCommercialAspect[];

  @OneToMany(() => ProductCertification, certification => certification.product)
  certifications: ProductCertification[];

  @OneToMany(() => ProductShipment, shipment => shipment.product)
  shipments: ProductShipment[];

  @OneToMany(() => ProductSpecification, specification => specification.product)
  specifications: ProductSpecification[];

  @OneToMany(() => Inquiry, inquiry => inquiry.product)
  inquiries: Inquiry[];

  @OneToMany(() => Requestsamples, requestSample => requestSample.product)
  requestSamples: Requestsamples[];

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
