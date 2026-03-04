import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BlogCategoryStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'blogcategory' })
export class BlogCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({
        type: 'enum',
        enum: BlogCategoryStatus,
        default: BlogCategoryStatus.ACTIVE,
    })
    status: BlogCategoryStatus;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
