import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';

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

    @Column({
        type: 'enum',
        enum: TradeofferStatus,
        default: TradeofferStatus.ACTIVE
    })
    status: TradeofferStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
