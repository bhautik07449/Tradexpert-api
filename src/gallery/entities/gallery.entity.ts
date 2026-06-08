import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'gallery' })
export class Gallery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'image' })
    image: string;

    @Column({ unique: true })
    sr_no: number;

    @Column({ nullable: true })
    country: string;

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
