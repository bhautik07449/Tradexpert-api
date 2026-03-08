import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'contact' })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    first_name: string;

    @Column({ name: 'last_name' })
    last_name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone', type: 'varchar', length: 15 })
    phone: number;

    @Column({ name: 'message' })
    message: string;

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
