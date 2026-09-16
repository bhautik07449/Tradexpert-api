import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
// import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'logo' })
  logo: string;

  @Column({ name: 'country', nullable: true })
  country: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'subcategory' })
  subcategory: Category;

  @Column({
    type: 'enum',
    enum: BrandStatus,
    default: BrandStatus.ACTIVE,
  })
  status: BrandStatus;

  @Column({ name: 'supplier_id', nullable: true })
  supplier_id: number;

  @Column({ name: 'supplier_name', nullable: true })
  supplier_name: string;

  @Column({ name: 'is_supplier_created', default: false })
  is_supplier_created: boolean;

  @Column({ name: 'approval_status', default: 'approved' })
  approval_status: string;

  // @OneToMany(() => Product, product => product.brand)
  // products: Product[];

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
