import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'policypreamble' })
export class PolicyPreamble {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: "country", nullable: true })
    country: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

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
