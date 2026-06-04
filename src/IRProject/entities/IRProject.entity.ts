import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'ir_project' })
export class IRProject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'title' })
    title: string

    @Column({ name: 'description' })
    description: string

    @Column({ name: 'image' })
    image: string

    @Column({ type: 'json', nullable: true })
    specification: { key: string; value: string }[];

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'subcategory' })
    subcategory: Category;

    @Column({ nullable: true })
    country: string | null;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: Status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
