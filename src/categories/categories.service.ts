import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(data: Partial<Category>): Promise<Category> {
        if (data.parent?.id) {
            const parent = await this.categoryRepository.findOne({
                where: { id: data.parent.id },
            });

            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }

            data.parent = parent;
        }

        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            relations: ['parent'],
        });

        return this.buildTree(categories);
    }

    async findAllByCountry(country: string): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            relations: ['parent'],
            where: { country },
        });

        return this.buildTree(categories);
    }

    async findFlat(): Promise<Category[]> {
        return this.categoryRepository.find({
            relations: ['parent'],
            order: { id: 'ASC' },
        });
    }

    async findParents(): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { parent: IsNull() },
            order: { id: 'ASC' },
        });
    }

    private buildTree(categories: Category[]): Category[] {
        const map = new Map<number, Category>();
        const roots: Category[] = [];

        categories.forEach((cat) => {
            map.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach((cat) => {
            if (cat.parent?.id) {
                const parent = map.get(cat.parent.id);
                if (parent) {
                    parent.children.push(map.get(cat.id));
                }
            } else {
                roots.push(map.get(cat.id));
            }
        });

        return roots;
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async update(id: number, data: Partial<Category>): Promise<Category> {
        const category = await this.findOne(id);

        if (data.parent?.id) {
            if (data.parent.id === id) {
                throw new BadRequestException('Category cannot be its own parent');
            }

            const parent = await this.categoryRepository.findOne({
                where: { id: data.parent.id },
            });

            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }

            category.parent = parent;
        }

        if (data.parent === null) {
            category.parent = null;
        }

        Object.assign(category, data);

        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<{ message: string }> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['children'],
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (category.children.length > 0) {
            throw new BadRequestException(
                'Cannot delete category with child categories',
            );
        }

        await this.categoryRepository.remove(category);

        return { message: 'Category deleted successfully' };
    }
}