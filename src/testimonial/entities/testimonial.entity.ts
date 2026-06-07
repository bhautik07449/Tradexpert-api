import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';

export enum TestimonialStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'testimonial' })
export class Testimonial {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client' })
    client: Client;

    @Column({ name: 'name' })
    review: string;

    @Column({ nullable: true })
    country: string | null;

    @Column({
        type: 'enum',
        enum: TestimonialStatus,
        default: TestimonialStatus.ACTIVE,
    })
    status: TestimonialStatus;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
