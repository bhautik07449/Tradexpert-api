import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('general_settings')
export class GeneralSettings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    siteName: string;

    @Column({ nullable: true })
    adminEmail: string;

    @Column({ nullable: true })
    careerEmail: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    siteMail: string;

    @Column({ nullable: true })
    siteMailName: string;

    @Column({ nullable: true })
    supportEmail: string;

    @Column({ nullable: true })
    certificationTitle: string;

    @Column({ nullable: true })
    videoTitle: string;

    @Column({ nullable: true })
    homeMetaKeyword: string;

    @Column({ nullable: true })
    homeMetaDescription: string;

    @Column({ nullable: true })
    siteMode: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    latitude: string;

    @Column({ nullable: true })
    longitude: string;

    @Column({ nullable: true })
    homePageVideo: string;

    @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
    lastUpdatedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}