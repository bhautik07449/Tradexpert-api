import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AlertStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'interwatch_alert' })
export class InterwatchAlert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'supplier_id', nullable: true })
    supplier_id: number;

    @Column({ name: 'supplier_name', nullable: true })
    supplier_name: string;

    @Column({ name: 'alert_type', default: 'Fall Short' })
    alert_type: string;

    @Column({ name: 'category', nullable: true })
    category: string;

    @Column({ name: 'reason_desc', type: 'text', nullable: true })
    reason_desc: string;

    @Column({ name: 'reason_type', default: 'Fall Short' })
    reason_type: string;

    @Column({ name: 'source_module', default: 'direct' })
    source_module: string;

    @Column({ name: 'source_id', nullable: true })
    source_id: number;

    @Column({ name: 'action_status', default: 'Pending' })
    action_status: string;

    @Column({ name: 'action_taken', type: 'text', nullable: true })
    action_taken: string;

    @Column({ name: 'admin_notes', type: 'text', nullable: true })
    admin_notes: string;

    @Column({
        type: 'enum',
        enum: AlertStatus,
        default: AlertStatus.ACTIVE
    })
    status: AlertStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
