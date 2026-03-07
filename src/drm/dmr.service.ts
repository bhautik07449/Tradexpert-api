import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { DMR } from './entities/dmr.entity';

@Injectable()
export class DRMService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(DMR)
        private readonly dmrRepo: Repository<DMR>,
    ) { }

    async create(body: any) {
        const category = await this.categoryRepo.findOne({
            where: { id: body.category },
        });

        if (!category) throw new NotFoundException('Category not found');

        const subcategory = await this.categoryRepo.findOne({
            where: { id: body.subcategory },
        });

        if (!subcategory) throw new NotFoundException('Subcategory not found');

        const product = this.dmrRepo.create({
            ...body,
            category,
            subcategory
        });

        const savedProduct = await this.dmrRepo.save(product);

        return {
            success: true,
            message: 'DMR created successfully',
            data: savedProduct,
        };
    }

    async findAll() {
        const products = await this.dmrRepo.find({
            relations: ['category', 'subcategory'],
            order: { id: 'DESC' },
        });

        return {
            success: true,
            message: 'DMR list fetched successfully',
            data: products,
        };
    }

    async findOne(id: number) {
        const product = await this.dmrRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory'],
        });

        if (!product) {
            throw new NotFoundException('DMR not found');
        }

        return {
            success: true,
            message: 'DMR fetched successfully',
            data: product,
        };
    }

    async update(id: number, body: any) {
        const product = await this.dmrRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory'],
        });

        if (!product) throw new NotFoundException('DMR not found');

        if (body.category) {
            const category = await this.categoryRepo.findOne({
                where: { id: body.category },
            });

            if (!category) throw new NotFoundException('Category not found');

            product.category = category;
        }

        if (body.subcategory) {
            const subcategory = await this.categoryRepo.findOne({
                where: { id: body.subcategory },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            product.subcategory = subcategory;
        }

        Object.assign(product, body);

        const updatedProduct = await this.dmrRepo.save(product);

        return {
            success: true,
            message: 'DMR updated successfully',
            data: updatedProduct,
        };
    }

    async delete(id: number) {
        const product = await this.dmrRepo.findOne({
            where: { id },
        });

        if (!product) throw new NotFoundException('DMR not found');

        await this.dmrRepo.remove(product);

        return {
            success: true,
            message: 'DMR deleted successfully',
        };
    }
}