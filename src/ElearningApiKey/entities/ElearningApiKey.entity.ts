import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'apikey' })
export class ElearningApiKey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'api_key' })
    api_key: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}