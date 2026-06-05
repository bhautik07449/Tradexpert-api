import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'upcoming_collaboration' })
export class UpcomingCollaboration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image' })
    image: string

    @Column({ name: 'url' })
    url: string

    @Column({ nullable: true })
    country: string | null;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: Status;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;
}
