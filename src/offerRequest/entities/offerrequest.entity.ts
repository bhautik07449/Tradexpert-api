import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';

export enum OfferRequestStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'offerrequest' })
export class OfferRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tradeoffer)
    @JoinColumn({ name: 'trade_offer' })
    trade_offer: Tradeoffer;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ name: 'phone', type: 'varchar', length: 15 })
    phone: string;

    @Column({ name: 'message', type: 'text' })
    message: string;

    @Column({ name: 'type', nullable: true })
    type: string

    @Column({
        type: 'enum',
        enum: OfferRequestStatus,
        default: OfferRequestStatus.ACTIVE
    })
    status: OfferRequestStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
