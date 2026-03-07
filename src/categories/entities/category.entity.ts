import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

export enum CategoryStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'slug', unique: true })
  slug: string;

  @Column({ name: 'page_title', type: 'text', nullable: true })
  pageTitle: string;

  @Column({ name: 'meta_keyword', type: 'text', nullable: true })
  metaKeyword: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
  })
  status: CategoryStatus;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
