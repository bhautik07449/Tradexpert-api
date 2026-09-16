import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { TradeofferItem } from './tradeoffer-item.entity';

export enum TradeofferStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'tradeoffer' })
export class Tradeoffer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tradetype)
    @JoinColumn({ name: 'trade_type' })
    trade_type: Tradetype;

    @Column()
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ nullable: true })
    country: string | null;

    @OneToMany(() => TradeofferItem, (item) => item.tradeoffer, { cascade: true })
    items: TradeofferItem[];

    @Column({
        type: 'enum',
        enum: TradeofferStatus,
        default: TradeofferStatus.ACTIVE
    })
    status: TradeofferStatus;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number;

    @Column({ name: 'supplier_name', nullable: true })
    supplier_name: string;

    @Column({ name: 'is_supplier_created', default: false })
    is_supplier_created: boolean;

    @Column({ name: 'approval_status', default: 'approved' })
    approval_status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
