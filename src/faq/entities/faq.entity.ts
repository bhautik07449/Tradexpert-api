import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'faq' })
export class Faq {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    answer: string;

    @Column({
        type: 'enum',
        enum: status,
        default: status.ACTIVE
    })
    status: status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
