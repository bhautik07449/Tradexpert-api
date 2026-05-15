import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GlobalImpotance } from './global.entity';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'contentoverview' })
export class ContentOverview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'country_background' })
    country_background: string;

    @Column({ name: 'category_specific' })
    category_specific: string;

    @OneToMany(() => GlobalImpotance, (impotance) => impotance.contentoverview, {
        cascade: true,
    })
    global_impotance: GlobalImpotance[];

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
