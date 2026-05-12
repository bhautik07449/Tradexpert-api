import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'homebanner' })
export class Homebanner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image' })
    image: string;

    @Column({ nullable: true })
    country: string | null;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

    @Column({
        type: 'enum',
        enum: status,
        default: status.ACTIVE,
    })
    status: status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
