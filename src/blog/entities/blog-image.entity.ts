import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity({ name: 'blog_images' })
export class BlogImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Blog, blog => blog.images)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
