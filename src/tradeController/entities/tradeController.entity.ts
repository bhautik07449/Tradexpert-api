import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'trade_data' })
export class TradeControllerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'hsn_code' })
    hsn_code: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    available_countries: { country_name: string }[];

    @Column({ type: 'jsonb', nullable: true, default: [] })
    import_data: { country: string; status: string; description: string; no: string }[];

    @Column({ type: 'jsonb', nullable: true, default: [] })
    export_data: { country: string; status: string; description: string; no: string }[];

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}