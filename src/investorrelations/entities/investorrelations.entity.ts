import { Financial } from 'src/financialservice/entities/financialservice.entity';
import { IRProject } from 'src/IRProject/entities/IRProject.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({ name: 'investorrelations' })
export class Investorrelations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'country', nullable: true })
    country: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product' })
    product: Product;

    @ManyToOne(() => Financial)
    @JoinColumn({ name: 'service' })
    service: Financial

    @ManyToOne(() => IRProject)
    @JoinColumn({ name: 'project' })
    project: Financial

    @Column({ name: 'message' })
    message: string;

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