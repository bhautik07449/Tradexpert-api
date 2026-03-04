import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { BlogCategory } from 'src/blogCategory/entities/blogcategory.entity';

export enum BlogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_date', type: 'timestamptz' })
  postDate: Date;

  @ManyToOne(() => BlogCategory)
  @JoinColumn({ name: 'blog_category' })
  blog_category: BlogCategory;

  @Column()
  name: string;

  @Column({ name: 'blog_title', type: 'text' })
  blogTitle: string;

  @Column({ name: 'blog_detail', type: 'text' })
  blogDetail: string;

  @Column('simple-array', { name: 'slider' })
  slider: string[];

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.ACTIVE
  })
  status: BlogStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}
