import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(data: Partial<Brand>): Promise<Brand> {
        if (!data) {
            throw new BadRequestException('Request body is required');
        }

        if (data.category && data.category.id) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.category.id },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            data.category = category;
        }

        const brand = this.brandRepository.create(data);
        return this.brandRepository.save(brand);
    }

    async findAll(): Promise<Brand[]> {
        return this.brandRepository.find({
            relations: ['category'],
        });
    }

    async findOne(id: number): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!brand) {
            throw new NotFoundException(`Brand with ID ${id} not found`);
        }

        return brand;
    }

    async update(id: number, data: Partial<Brand>): Promise<Brand> {
        const brand = await this.findOne(id);

        if (data.category?.id) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.category.id },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            brand.category = category;
        }

        Object.assign(brand, data);

        return this.brandRepository.save(brand);
    }

    async remove(id: number): Promise<{ message: string }> {
        const brand = await this.brandRepository.findOne({
            where: { id }
        });

        if (!brand) {
            throw new NotFoundException('Brand not found');
        }

        // if (brand.products.length > 0) {
        //     throw new BadRequestException(
        //         'Cannot delete brand with associated products',
        //     );
        // }

        await this.brandRepository.remove(brand);

        return { message: 'Brand deleted successfully' };
    }
}