import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { TradeLawEntity, Status } from './entities/tradeLaw.entity';

@Injectable()
export class TradeLawService {
    constructor(
        @InjectRepository(TradeLawEntity)
        private readonly tradeLawRepo: Repository<TradeLawEntity>,
    ) {}

    async create(body: Partial<TradeLawEntity>) {
        const newTradeLaw = this.tradeLawRepo.create(body);
        const savedData = await this.tradeLawRepo.save(newTradeLaw);
        return { message: 'Trade Law added successfully', data: savedData };
    }

    findAll(department?: string, country?: string) {
        const where: any = { status: Not(Status.DELETED) };
        
        if (department) {
            where.department = ILike(`%${department}%`);
        }
        
        if (country) {
            where.country = ILike(`%${country}%`);
        }
        
        return this.tradeLawRepo.find({ where });
    }

    findOne(id: number) {
        return this.tradeLawRepo.findOne({ where: { id, status: Not(Status.DELETED) } });
    }

    async update(id: number, body: Partial<TradeLawEntity>) {
        await this.tradeLawRepo.update(id, body);
        const data = await this.findOne(id);
        return { message: 'Trade Law updated successfully', data };
    }

    async remove(id: number) {
        const record = await this.tradeLawRepo.findOne({ where: { id, status: Not(Status.DELETED) } });
        if (record) {
            record.status = Status.DELETED;
            await this.tradeLawRepo.save(record);
        }
        return { message: 'Trade Law deleted successfully' };
    }
}