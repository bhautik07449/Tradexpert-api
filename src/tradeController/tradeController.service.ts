import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, Not } from 'typeorm';
import { TradeControllerEntity, Status } from './entities/tradeController.entity';
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
            
            // Assign the actual entity to body.category so TypeORM saves the relation
            body.category = category;
        }

        if (body.import_data && body.import_data.length === 0) {
            body.import_data = [];
        }
        if (body.export_data && body.export_data.length === 0) {
            body.export_data = [];
        }

        const newTrade = this.tradeRepo.create({
            ...body,
            hsn_code,
        });

        const savedTrade = await this.tradeRepo.save(newTrade);
        return { message: 'Trade Controller added successfully', data: savedTrade };
    }

    async findAll(hsn_code?: string, description?: string) {
        const where: any = { status: Not(Status.DELETED) };
        
        if (hsn_code) {
            where.hsn_code = ILike(`%${hsn_code}%`);
        }
        
        if (description) {
            where.description = ILike(`%${description}%`);
        }

        const records = await this.tradeRepo.find({ 
            where,
            relations: ['category'] 
        });

        return records.map(record => {
            if (record.import_data) {
                record.import_data = record.import_data || [];
            } else {
                delete record.import_data;
            }
            
            if (record.export_data) {
                record.export_data = record.export_data || [];
            } else {
                delete record.export_data;
            }
            return record;
        });
    }

    async findOne(id: number) {
        const record = await this.tradeRepo.findOne({ where: { id, status: Not(Status.DELETED) }, relations: ['category'] });
        if (record) {
            if (record.import_data) {
                record.import_data = record.import_data || [];
            } else {
                delete record.import_data;
            }
            
            if (record.export_data) {
                record.export_data = record.export_data || [];
            } else {
                delete record.export_data;
            }
        }
        return record;
    }

    async update(id: number, body: any) {
        const existing = await this.tradeRepo.findOne({ where: { id, status: Not(Status.DELETED) } });
        if (!existing) throw new NotFoundException('Trade data not found');

        if (body.category) {
            const categoryId = typeof body.category === 'object' ? body.category.id : body.category;
            const category = await this.categoryRepo.findOne({ where: { id: Number(categoryId) } });
            if (!category) throw new NotFoundException('Category not found');
            body.category = category;
        }

        this.tradeRepo.merge(existing, body);
        
        // Explicitly assign JSON fields to prevent TypeORM deep array merge issues
        if (body.has_import_data === false) {
            existing.import_data = [];
        } else if (body.import_data !== undefined) {
            existing.import_data = body.import_data;
        }

        if (body.has_export_data === false) {
            existing.export_data = [];
        } else if (body.export_data !== undefined) {
            existing.export_data = body.export_data;
        }
        if (body.available_countries !== undefined) {
            existing.available_countries = body.available_countries;
        }

        await this.tradeRepo.save(existing);
        
        const data = await this.findOne(id);
        return { message: 'Trade Controller updated successfully', data };
    }

    async remove(id: number) {
        const record = await this.tradeRepo.findOne({ where: { id, status: Not(Status.DELETED) } });
        if (record) {
            record.status = Status.DELETED;
            await this.tradeRepo.save(record);
        }
        return { message: 'Trade Controller deleted successfully' };
    }
}
