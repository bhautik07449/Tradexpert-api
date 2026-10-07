import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'develop_prepositions' })
export class DevelopPreposition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    belief: string;

    @Column()
    purpose: string;

    @Column()
    goal: string;

    @Column()
    name: string;

    @Column()
    aim: string;

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