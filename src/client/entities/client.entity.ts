import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'client' })
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    first_name: string;

    @Column({ name: 'last_name' })
    last_name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone', type: 'varchar', length: 15 })
    phone: Number;

    @Column({ name: 'image' })
    image: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
