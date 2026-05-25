import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
// import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
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

  @Column({
    type: 'enum',
    enum: BrandStatus,
    default: BrandStatus.ACTIVE,
  })
  status: BrandStatus;

  // @OneToMany(() => Product, product => product.brand)
  // products: Product[];

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
