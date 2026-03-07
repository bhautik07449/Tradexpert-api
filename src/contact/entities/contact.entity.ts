import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'contact' })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: number;

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
