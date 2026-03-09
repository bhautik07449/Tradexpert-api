import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('social_settings')
export class SocialSettings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    facebook: string;

    @Column({ nullable: true })
    instagram: string;

    @Column({ nullable: true })
    linkedIn: string;

    @Column({ nullable: true })
    pinterest: string;

    @Column({ nullable: true })
    twitter: string;

    @Column({ nullable: true })
    google: string;

    @Column({ nullable: true })
    youtube: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}