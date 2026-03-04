import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailtemplateStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'emailtemplate' })
export class EmailTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'subject', type: 'text' })
    subject: string;

    @Column({
        type: 'enum',
        enum: EmailtemplateStatus,
        default: EmailtemplateStatus.ACTIVE,
    })
    status: EmailtemplateStatus;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
