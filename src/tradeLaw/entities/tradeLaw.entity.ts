import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'trade_law' })
export class TradeLawEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'department' })
    department: string;

    @Column({name: 'country'})
    country: string;

    @Column({ name: 'act_details', type: 'text' })
    act_details: string;

    @Column({ name: 'more_details', type: 'text', nullable: true })
    more_details: string;

    @Column({ type: 'jsonb', nullable: true })
    usefull_when: string[];

    @Column({ name: 'use_case', type: 'text', nullable: true })
    use_case: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}