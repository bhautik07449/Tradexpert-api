import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { TradeControllerEntity } from './entities/tradeController.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TradeControllerService {
    constructor(
        @InjectRepository(TradeControllerEntity)
        private readonly tradeRepo: Repository<TradeControllerEntity>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async create(body: Partial<TradeControllerEntity>) {
        let hsn_code = body.hsn_code;

        if (!hsn_code && body.category) {
            const categoryId = typeof body.category === 'object' ? body.category.id : body.category;
            const category = await this.categoryRepo.findOne({ where: { id: Number(categoryId) } });

            if (!category) {
                throw new NotFoundException(`Category not found`);
            }

            const prefix = category.name.substring(0, 3).toUpperCase();
            const lastRecord = await this.tradeRepo.findOne({
                where: { hsn_code: Like(`${prefix}%`) },
                order: { hsn_code: 'DESC' },
            });

            let nextNumber = 1;
            if (lastRecord && lastRecord.hsn_code) {
                const lastNumber = parseInt(lastRecord.hsn_code.replace(prefix, ''), 10);
                if (!isNaN(lastNumber)) {
                    nextNumber = lastNumber + 1;
                }
            }
            hsn_code = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
        }

        const newTrade = this.tradeRepo.create({
            ...body,
            hsn_code,
        });

        const savedTrade = await this.tradeRepo.save(newTrade);
        return { message: 'Trade Controller added successfully', data: savedTrade };
    }

    findAll(hsn_code?: string, description?: string) {
        const where: any = {};
        
        if (hsn_code) {
            where.hsn_code = ILike(`%${hsn_code}%`);
        }
        
        if (description) {
            where.description = ILike(`%${description}%`);
        }

        return this.tradeRepo.find({ 
            where,
            relations: ['category'] 
        });
    }

    findOne(id: number) {
        return this.tradeRepo.findOne({ where: { id }, relations: ['category'] });
    }

    async update(id: number, body: Partial<TradeControllerEntity>) {
        await this.tradeRepo.update(id, body);
        const data = await this.findOne(id);
        return { message: 'Trade Controller updated successfully', data };
    }

    async remove(id: number) {
        const record = await this.findOne(id);
        if (record) {
            await this.tradeRepo.remove(record);
        }
        return { message: 'Trade Controller deleted successfully' };
    }
}
