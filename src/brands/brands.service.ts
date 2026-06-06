import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
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

    async findAll(country?: string): Promise<Brand[]> {
        const whereCondition = country ? { country } : {};

        return this.brandRepository.find({
            where: whereCondition,
            relations: ['category'],
        });
    }

    async groupByCategoryAndCountry(country?: string) {
        const whereCondition = country ? { country } : {};

        const list = await this.brandRepository.find({
            where: whereCondition,
            relations: ['category'],
            order: {
                country: 'ASC',
                category: { id: 'ASC' },
            },
        });

        const uniqueCategoryIds = [
            ...new Set(
                list
                    .map((item) => item.category?.id)
                    .filter((id): id is number => id !== undefined && id !== null),
            ),
        ];

        const categoriesWithChildren = await this.categoryRepository.find({
            where: uniqueCategoryIds.map((id) => ({ id })),
            relations: ['children'],
        });

        const subcategoryMap = new Map<number, Category[]>();
        for (const cat of categoriesWithChildren) {
            subcategoryMap.set(cat.id, cat.children ?? []);
        }

        const products = uniqueCategoryIds.length
            ? await this.productRepository.find({
                  where: { category: { id: In(uniqueCategoryIds) } },
                  relations: ['category', 'subcategory', 'offer_type', 'offer_type.items', 'offer_type.items.product'],
              })
            : [];

        const productMap = new Map<number, Product[]>();
        for (const product of products) {
            const catId = product.category?.id;
            if (catId !== undefined && catId !== null) {
                if (!productMap.has(catId)) productMap.set(catId, []);
                productMap.get(catId)!.push(product);
            }
        }

        const groupedData = list.reduce(
            (acc, item) => {
                const countryName = item.country || 'no-country';
                const categoryId = item.category?.id ?? 'no-category';

                if (!acc[countryName]) {
                    acc[countryName] = { country: countryName, category: {} };
                }

                if (!acc[countryName].category[categoryId]) {
                    acc[countryName].category[categoryId] = {
                        category: item.category,
                        brands: [],
                    };
                }

                acc[countryName].category[categoryId].brands.push(item);
                return acc;
            },
            {} as Record<
                string,
                {
                    country: string;
                    category: Record<
                        string | number,
                        { category: Category | null; brands: Brand[] }
                    >;
                }
            >,
        );
        const data = Object.values(groupedData).map((countryGroup) => ({
            country: countryGroup.country,
            category: Object.values(countryGroup.category).map((catGroup) => ({
                category: catGroup.category,
                subcategories: subcategoryMap.get(catGroup.category?.id) ?? [],
                products: productMap.get(catGroup.category?.id) ?? [],
                brands: catGroup.brands,
            })),
        }));

        return {
            success: true,
            message: 'Brand list fetched successfully',
            data,
        };
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