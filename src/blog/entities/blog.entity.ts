import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BlogCategory } from './blog-category.entity';
import { BlogImage } from './blog-image.entity';

export enum BlogStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_date', type: 'datetime' })
  postDate: Date;

  @Column()
  name: string;

  @Column('text')
  photo: string;

  @Column({ name: 'blog_detail', type: 'text' })
  blogDetail: string;

  @Column({
    type: 'enum',
    enum: BlogStatus,
  })
  status: BlogStatus;

  @Column({ name: 'blog_title', type: 'text' })
  blogTitle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @ManyToOne(() => BlogCategory, category => category.blogs)
  @JoinColumn({ name: 'blog_category_id' })
  category: BlogCategory;

  @OneToMany(() => BlogImage, image => image.blog)
  images: BlogImage[];
}
