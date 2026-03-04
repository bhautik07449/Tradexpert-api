import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'team' })
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'facebook' })
    facebook: string;

    @Column({ name: 'twitter' })
    twitter: string;

    @Column({ name: 'linkedin' })
    linkedin: string;

    @Column({ name: 'google' })
    google: string;

    @Column({ name: 'youtube' })
    youtube: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
