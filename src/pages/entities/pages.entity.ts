import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum PageStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('pages')
export class Page {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    page_name: string;

    @Column({ type: 'varchar', length: 150 })
    page_title: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    page_url: string;

    @Column({ type: 'text', nullable: true })
    page_meta_title: string;

    @Column({ type: 'text', nullable: true })
    meta_keyword: string;

    @Column({ type: 'text', nullable: true })
    meta_description: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({
        type: 'enum',
        enum: PageStatus,
        default: PageStatus.ACTIVE,
    })
    status: PageStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_updated_at' })
    lastUpdatedAt: Date;
}