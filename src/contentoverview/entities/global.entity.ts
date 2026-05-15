import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ContentOverview } from './contentoverview.entity';

@Entity()
export class GlobalImpotance {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ContentOverview, (contentoverview) => contentoverview.global_impotance, {
        onDelete: 'CASCADE'
    })

    @JoinColumn({ name: 'contentoverview_id' })
    contentoverview: ContentOverview;
}