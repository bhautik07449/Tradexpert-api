import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'esg' })
export class ESG {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'tag' })
    tag: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

    @Column({ name: 'country', nullable: true })
    country: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
