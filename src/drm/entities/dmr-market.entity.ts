import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DMR } from './dmr.entity';

@Entity()
export class MarketDetails {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column()
  quality: string;

  @Column()
  rate: string;

  @Column()
  packing: string;

  @Column()
  delivery: string;

  @Column()
  categoryType: string;

  @Column()
  noOfPacking: string;

  @ManyToOne(() => DMR, (dmr) => dmr.market, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'dmr_id' })
  dmr: DMR;
}