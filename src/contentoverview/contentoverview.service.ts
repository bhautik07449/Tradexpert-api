import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ContentOverview } from './entities/contentoverview.entity'; import { GlobalImpotance } from './entities/global.entity';

@Injectable()
export class ContentOverviewService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(ContentOverview)
        private readonly contentoverviewRepo: Repository<ContentOverview>,
    ) { }

    async create(body: any) {
        const category = await this.categoryRepo.findOne({
            where: { id: body.category },
        });

        if (!category) throw new NotFoundException('Category not found');

        const existingRecord = await this.contentoverviewRepo.findOne({
            where: {
                country: body.country,
                category: { id: body.category },
            },
        });

        if (existingRecord) {
            throw new BadRequestException(`Content overview for this category and country combination already exists`);
        }

        const contentoverview = this.contentoverviewRepo.create({
            ...body,
            category,
        });

        const savedContentOverview = await this.contentoverviewRepo.save(contentoverview);

        return {
            success: true,
            message: 'Content Overview created successfully',
            data: savedContentOverview,
        };
    }

    async findAll() {
        const contentoverview = await this.contentoverviewRepo.find({
            relations: ['category', 'global_impotance'],
            order: { id: 'DESC' },
        });

        return {
            success: true,
            message: 'Content Overview list fetched successfully',
            data: contentoverview,
        };
    }

    async findOne(id: number) {
        const contentoverview = await this.contentoverviewRepo.findOne({
            where: { id },
            relations: ['category', 'global_impotance'],
        });

        if (!contentoverview) {
            throw new NotFoundException('Content Overview not found');
        }

        return {
            success: true,
            message: 'Content Overview fetched successfully',
            data: contentoverview,
        };
    }

    async findByCategory(category: any) {
        const contentoverview = await this.contentoverviewRepo.findOne({
            where: { category: { id: category } },
            relations: ['category', 'global_impotance'],
        });

        if (!contentoverview) {
            throw new NotFoundException('Content Overview not found');
        }

        return {
            success: true,
            message: 'Content Overview fetched successfully',
            data: contentoverview,
        };
    }

    async update(id: number, body: any) {
        const contentoverview = await this.contentoverviewRepo.findOne({
            where: { id },
            relations: ['category', 'global_impotance'],
        });

        if (!contentoverview) throw new NotFoundException('Content Overview not found');

        const countryToCheck = body.country !== undefined ? body.country : contentoverview.country;
        const categoryIdToCheck = body.category !== undefined ? body.category : (contentoverview.category ? contentoverview.category.id : undefined);

        const existingRecord = await this.contentoverviewRepo.findOne({
            where: {
                country: countryToCheck,
                category: { id: categoryIdToCheck },
            },
        });

        if (existingRecord && existingRecord.id !== id) {
            throw new BadRequestException(`Content overview for this category and country combination already exists`);
        }

        if (body.category) {
            const category = await this.categoryRepo.findOne({
                where: { id: body.category },
            });

            if (!category) throw new NotFoundException('Category not found');

            contentoverview.category = category;
        }

        Object.assign(contentoverview, body);

        const updatedContentOverview = await this.contentoverviewRepo.save(contentoverview);

        return {
            success: true,
            message: 'Content Overview updated successfully',
            data: updatedContentOverview,
        };
    }

    async delete(id: number) {
        const contentoverview = await this.contentoverviewRepo.findOne({
            where: { id },
        });

        if (!contentoverview) throw new NotFoundException('Content Overview not found');

        await this.contentoverviewRepo.remove(contentoverview);

        return {
            success: true,
            message: 'Content Overview deleted successfully',
        };
    }
}