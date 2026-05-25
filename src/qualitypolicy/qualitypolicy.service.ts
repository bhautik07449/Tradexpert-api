import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qualitypolicy } from './entities/qualitypolicy.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class QualitypolicyService {
    constructor(
        @InjectRepository(Qualitypolicy)
        private readonly qualityRepository: Repository<Qualitypolicy>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(data: Partial<Qualitypolicy>) {
        if (!data) {
            throw new BadRequestException('Request body is required');
        }

        if (data.category?.id) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.category.id },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            data.category = category;
        }

        const quality = this.qualityRepository.create(data);
        const saved = await this.qualityRepository.save(quality);

        return {
            success: true,
            message: 'Quality Policy created successfully',
            data: saved,
        };
    }

    async findAll(country?: string) {
        const whereCondition = country ? { country } : {};

        const list = await this.qualityRepository.find({
            relations: ['category'],
            where: whereCondition,
        });

        return {
            success: true,
            message: 'Quality Policy list fetched successfully',
            data: list,
        };
    }

    async groupByCategoryAndCountry() {
        const list = await this.qualityRepository.find({
            relations: ['category'],
            order: {
                category: {
                    id: 'ASC',
                },
            },
        });

        const groupedData = list.reduce((acc, item) => {
            const categoryId = item.category?.id || 'no-category';
            const countryName = item.country || 'no-country';

            const key = `${categoryId}-${countryName}`;

            if (!acc[key]) {
                acc[key] = {
                    category: item.category,
                    country: item.country,
                    data: [],
                };
            }

            acc[key].data.push(item);

            return acc;
        }, {} as Record<string, {
            category: Category | null;
            country: string;
            data: Qualitypolicy[];
        }>);

        return {
            success: true,
            message: 'Quality Policy list fetched successfully',
            data: Object.values(groupedData),
        };
    }

    async findOne(id: number) {
        const quality = await this.qualityRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!quality) {
            throw new NotFoundException(
                `Quality Policy with ID ${id} not found`,
            );
        }

        return {
            success: true,
            message: 'Quality Policy fetched successfully',
            data: quality,
        };
    }

    async update(id: number, data: Partial<Qualitypolicy>) {
        const quality = await this.qualityRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!quality) {
            throw new NotFoundException('Quality Policy not found');
        }

        if (data.category?.id) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.category.id },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            quality.category = category;
        }

        Object.assign(quality, data);

        const updated = await this.qualityRepository.save(quality);

        return {
            success: true,
            message: 'Quality Policy updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const quality = await this.qualityRepository.findOne({
            where: { id },
        });

        if (!quality) {
            throw new NotFoundException('Quality Policy not found');
        }

        await this.qualityRepository.remove(quality);

        return {
            success: true,
            message: 'Quality Policy deleted successfully',
        };
    }
}