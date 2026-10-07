import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DevelopPreposition } from '../../develop-prepositions/entities/develop-preposition.entity';
import { Career } from '../../career/entities/career.entity';

export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
}

@Entity({ name: 'develop_topologies' })
export class DevelopTopology {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    prepositionId: number;

    @ManyToOne(() => DevelopPreposition)
    @JoinColumn({ name: 'prepositionId' })
    preposition: DevelopPreposition;

    @Column()
    candidateId: number;

    @ManyToOne(() => Career)
    @JoinColumn({ name: 'candidateId' })
    candidate: Career;

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