import { Category } from 'src/categories/entities/category.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum QualityPoliciesStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('Qualitypolicy')
export class Qualitypolicy {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'logo' })
    logo: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'country', nullable: true })
    country: string;

    @Column({
        type: 'enum',
        enum: QualityPoliciesStatus,
        default: QualityPoliciesStatus.ACTIVE,
    })
    status: QualityPoliciesStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at' })
    lastUpdatedAt: Date;
}