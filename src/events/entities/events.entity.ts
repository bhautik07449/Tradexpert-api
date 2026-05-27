import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'events' })
export class Events {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'tag' })
    tag: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'country', nullable: true })
    country: string;

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