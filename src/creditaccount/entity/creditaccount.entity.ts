import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class CreditAccount {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    companyName: string;

    @Column()
    country: string;

    @Column()
    established: string;

    @Column()
    noofemployees: string;

    @Column()
    bankName: string;

    @Column()
    bankContact: string;

    @Column()
    bankEmail: string;

    @Column()
    bankAddress: string;

    @Column()
    supplier1Name: string;

    @Column()
    supplier1Contact: string;

    @Column()
    supplier1Email: string;

    @Column()
    supplier1Address: string;

    @Column()
    supplier1Years: string;

    @Column()
    supplier2Name: string;

    @Column()
    supplier2Contact: string;

    @Column()
    supplier2Email: string;

    @Column()
    supplier2Address: string;

    @Column()
    supplier2Years: string;

    @Column()
    yourName: string;

    @Column()
    yourEmail: string;

    @Column()
    yourPosition: string;

    @Column()
    terms: string;

    @Column()
    agree: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}