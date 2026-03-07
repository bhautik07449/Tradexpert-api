import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { MarketDetails } from './dmr-market.entity';

@Entity()
export class DMR {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category' })
    category: Category;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'subcategory' })
    subcategory: Category;

    @OneToMany(() => MarketDetails, (market) => market.dmr, {
        cascade: true,
    })
    market: MarketDetails[];
}