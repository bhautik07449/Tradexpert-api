import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { DMR } from './entities/dmr.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class DRMService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(DMR)
        private readonly dmrRepo: Repository<DMR>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async create(body: any) {
        const category = await this.categoryRepo.findOne({
            where: { id: body.category },
        });

        if (!category) throw new NotFoundException('Category not found');

        const subcategory = await this.categoryRepo.findOne({
            where: { id: body.subCategory },
        });

        if (!subcategory) throw new NotFoundException('Subcategory not found');

        const product = await this.productRepo.findOne({
            where: { id: body.product },
        });

        if (!product) throw new NotFoundException('Product not found');

        const dmr = this.dmrRepo.create({
            ...body,
            category,
            subcategory,
            product
        });

        const savedDMR = await this.dmrRepo.save(dmr);

        return {
            success: true,
            message: 'DMR created successfully',
            data: savedDMR,
        };
    }

    async findAll() {
        const dmr = await this.dmrRepo.find({
            relations: ['category', 'subcategory', 'market', 'product'],
            order: { id: 'DESC' },
        });

        return {
            success: true,
            message: 'DMR list fetched successfully',
            data: dmr,
        };
    }

    async findOne(id: number) {
        const dmr = await this.dmrRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'market', 'product'],
        });

        if (!dmr) {
            throw new NotFoundException('DMR not found');
        }

        return {
            success: true,
            message: 'DMR fetched successfully',
            data: dmr,
        };
    }

    async update(id: number, body: any) {
        const dmr = await this.dmrRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'market', 'product'],
        });

        if (!dmr) throw new NotFoundException('DMR not found');

        if (body.category) {
            const category = await this.categoryRepo.findOne({
                where: { id: body.category },
            });

            if (!category) throw new NotFoundException('Category not found');

            dmr.category = category;
        }

        if (body.subCategory) {
            const subcategory = await this.categoryRepo.findOne({
                where: { id: body.subCategory },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            dmr.subcategory = subcategory;
        }

        if (body.product) {
            const product = await this.productRepo.findOne({
                where: { id: body.product },
            });

            if (!product) throw new NotFoundException('Product not found');

            dmr.product = product;
        }

        Object.assign(dmr, body);

        const updatedDMR = await this.dmrRepo.save(dmr);

        return {
            success: true,
            message: 'DMR updated successfully',
            data: updatedDMR,
        };
    }

    async delete(id: number) {
        const dmr = await this.dmrRepo.findOne({
            where: { id },
        });

        if (!dmr) throw new NotFoundException('DMR not found');

        await this.dmrRepo.remove(dmr);

        return {
            success: true,
            message: 'DMR deleted successfully',
        };
    }
}