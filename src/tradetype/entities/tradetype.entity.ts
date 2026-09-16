import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TradetypeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'tradetype' })
export class Tradetype {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ nullable: true })
    country: string;

    @Column({
        type: 'enum',
        enum: TradetypeStatus,
        default: TradetypeStatus.ACTIVE,
    })
    status: TradetypeStatus;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number;

    @Column({ name: 'supplier_name', nullable: true })
    supplier_name: string;

    @Column({ name: 'is_supplier_created', default: false })
    is_supplier_created: boolean;

    @Column({ name: 'approval_status', default: 'approved' })
    approval_status: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
