import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

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

    @Column({ type: 'jsonb', nullable: true })
    import_data: { country: string; status: string; description: string; no: string }[];

    @Column({ type: 'jsonb', nullable: true })
    export_data: { country: string; status: string; description: string; no: string }[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}