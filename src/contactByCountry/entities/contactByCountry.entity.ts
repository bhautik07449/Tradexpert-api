import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'contactno' })
export class ContactNo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'country', nullable: true })
    country: string;

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
