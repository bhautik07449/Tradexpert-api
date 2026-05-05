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
        if (data.productId) data.product = { id: data.productId };

        const abc = this.abcRepo.create(data);
        const saved: any = await this.abcRepo.save(abc);
        const savedId = Array.isArray(saved) ? saved[0].id : saved.id;

        const fullData = await this.abcRepo.findOne({
            where: { id: savedId },
            relations: ['category', 'subcategory', 'product', 'product.category', 'product.subcategory'],
        });

        return {
            success: true,
            message: 'ABC entry created successfully',
            data: fullData,
        };
    }

    async findAll() {
        const data = await this.abcRepo.find({
            relations: ['category', 'subcategory', 'product'],
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
            relations: ['category', 'subcategory', 'product'],
            order: { createdAt: 'DESC' },
        });

        const groupedMap = new Map<string, any>();

        data.forEach(item => {
            const key = `${item.category?.id || 'no-cat'}-${item.subcategory?.id || 'no-sub'}`;
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    category: item.category,
                    subcategory: item.subcategory,
                    items: []
                });
            }
            if (item.product) {
                groupedMap.get(key).items.push(item.product);
            }
        });

        return {
            success: true,
            message: 'ABC entries fetched successfully',
            data: Array.from(groupedMap.values()),
        };
    }

    async findOne(id: number) {
        const data = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'product', 'product.category', 'product.subcategory'],
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
        if (body.productId) body.product = { id: body.productId };

        Object.assign(abc, body);
        await this.abcRepo.save(abc);

        const updated = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'product', 'product.category', 'product.subcategory'],
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
