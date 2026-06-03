import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'career' })
export class Career {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'contact' })
    contact: string;

    @Column({ name: 'email' })
    email: string;

    @Exclude()
    @Column({ nullable: true })
    password?: string;

    @Column({ name: 'family_member' })
    family_member: string;

    @Column({ name: 'age' })
    age: string;

    @Column({ name: 'marital_status' })
    marital_status: string;

    @Column({ name: 'gender' })
    gender: string;

    @Column({ name: 'education' })
    education: string;

    @Column({ name: 'certification' })
    certification: string;

    @Column({ name: 'experience' })
    experience: string;

    @Column({ name: 'work_interest' })
    work_interest: string;

    @Column({ name: 'personal_initiative' })
    personal_initiative: string;

    @Column({ name: 'nationality' })
    nationality: string;

    @Column({ name: 'caste' })
    caste: string;

    @Column({ name: 'race' })
    race: string;

    @Column({ name: 'hobbies' })
    hobbies: string;

    @Column({ name: 'culture' })
    culture: string;

    @Column({ name: 'faith' })
    faith: string;

    @Column({ name: 'income_class' })
    income_class: string;

    @Column({ name: 'hourly_income' })
    hourly_income: string;

    @Column({ name: 'monthly_income' })
    monthly_income: string;

    @Column({ name: 'yearly_income' })
    yearly_income: string;

    @Column({ name: 'tax_payer_class' })
    tax_payer_class: string;

    @Column({ name: 'house_ownership' })
    house_ownership: string;

    @Column({ name: 'economic_class' })
    economic_class: string;

    @Column({ name: 'business_model' })
    business_model: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
