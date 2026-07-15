import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'request_info' })
export class RequestInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    first_name: string;

    @Column({ name: 'country', nullable: true })
    country: string;
    
    @Column({ name: 'last_name' })
    last_name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'state' })
    state: string;

    @Column({ name: 'city' })
    city: string;

    @Column({ name: 'street' })
    street: string;

    @Column({ name: 'unit' })
    unit: string;

    @Column({ name: 'postal' })
    postal: string;

    @Column({ name: 'available_cash' })
    available_cash: string;

    @Column({ name: 'contact_method' })
    contact_method: string;

    @Column({ name: 'contact_detail' })
    contact_detail: string;

    @Column({ name: 'investment_diligence' })
    investment_diligence: string;

    @Column({ name: 'best_time_to_call' })
    best_time_to_call: string;

    @Column({ name: 'comment' })
    comment: string;

    @Column({ name: 'updates_opt_in' })
    updates_opt_in: boolean;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}