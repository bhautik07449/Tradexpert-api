import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailtemplateStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'emailtemplate' })
export class EmailTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'template_name', nullable: true })
    template_name: string;

    @Column({ name: 'email_subject', type: 'text', nullable: true })
    email_subject: string;

    @Column({ name: 'email_body', type: 'text', nullable: true })
    email_body: string;

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
