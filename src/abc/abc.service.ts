import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abc } from './entities/abc.entity';

@Injectable()
export class AbcService {
    constructor(
        @InjectRepository(Abc)
        private readonly abcRepo: Repository<Abc>,
    ) { }

    async create(data: any) {
        if (data.categoryId) data.category = { id: data.categoryId };
        if (data.subCategoryId) data.subcategory = { id: data.subCategoryId };
        
        if (data.product) {
            data.products = [{ id: data.product }];
        } else if (data.productId) {
            data.products = [{ id: data.productId }];
        } else if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(id => typeof id === 'object' ? id : { id });
        }

        const abc = this.abcRepo.create(data);
        const saved: any = await this.abcRepo.save(abc);
        const savedId = Array.isArray(saved) ? saved[0].id : saved.id;

        const fullData = await this.abcRepo.findOne({
            where: { id: savedId },
            relations: ['category', 'subcategory', 'products'],
        });

        return {
            success: true,
            message: 'ABC entry created successfully',
            data: fullData,
        };
    }

    async findAll() {
        const data = await this.abcRepo.find({
            relations: ['category', 'subcategory', 'products'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'ABC entries fetched successfully',
            data: data,
        };
    }


    async groupedData() {
        const data = await this.abcRepo.find({
            relations: ['category', 'subcategory', 'products'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'ABC entries fetched successfully',
            data,
        };
    }

    async findOne(id: number) {
        const data = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products'],
        });

        if (!data) throw new NotFoundException('ABC entry not found');

        return {
            success: true,
            message: 'ABC entry fetched successfully',
            data,
        };
    }

    async update(id: number, body: any) {
        const abc = await this.abcRepo.findOne({
            where: { id },
        });

        if (!abc)
            throw new NotFoundException('ABC entry not found');

        if (body.categoryId) body.category = { id: body.categoryId };
        if (body.subCategoryId) body.subcategory = { id: body.subCategoryId };
        
        if (body.product) {
            body.products = [{ id: body.product }];
        } else if (body.productId) {
            body.products = [{ id: body.productId }];
        } else if (body.products && Array.isArray(body.products)) {
            body.products = body.products.map(id => typeof id === 'object' ? id : { id });
        }

        Object.assign(abc, body);
        await this.abcRepo.save(abc);

        const updated = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products'],
        });

        return {
            success: true,
            message: 'ABC entry updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const abc = await this.abcRepo.findOne({
            where: { id },
        });

        if (!abc)
            throw new NotFoundException('ABC entry not found');

        await this.abcRepo.remove(abc);

        return {
            success: true,
            message: 'ABC entry deleted successfully',
        };
    }
}
