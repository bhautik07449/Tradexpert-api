import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { BlogCategory } from 'src/blogCategory/entities/blogcategory.entity';

export enum BlogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_date', type: 'date' })
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

  @Column({ name: 'slider', nullable: true })
  slider: string;

  @Column({ nullable: true })
  country: string | null;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.INACTIVE
  })
  status: BlogStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}
