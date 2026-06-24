import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

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

    async getHierarchy(country?: string): Promise<any[]> {
        // 1. Fetch categories
        const categories = await this.categoryRepository.find({
            relations: ['parent'],
            order: { id: 'ASC' },
        });

        // 2. Fetch products
        const products = await this.categoryRepository.manager.getRepository(Product).find({
            relations: ['category', 'subcategory', 'finacial_service'],
            order: { id: 'ASC' },
        });

        // 3. Create a map of categories for quick access
        const categoryMap = new Map<number, any>();
        const parentCategories: any[] = [];
        const subCategories: any[] = [];

        categories.forEach(cat => {
            const node = {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                pageTitle: cat.pageTitle,
                metaKeyword: cat.metaKeyword,
                metaDescription: cat.metaDescription,
                status: cat.status,
                country: cat.country,
                createdAt: cat.createdAt,
                lastUpdatedAt: cat.lastUpdatedAt,
                subcategories: [], // Level 3 subcategories go here if node is parent
                products: [],      // Level 4 products go here if node is subcategory
            };
            categoryMap.set(cat.id, node);

            if (!cat.parent) {
                parentCategories.push(node);
            } else {
                subCategories.push({ cat, node });
            }
        });

        // 4. Link subcategories to parent categories
        subCategories.forEach(({ cat, node }) => {
            const parentNode = categoryMap.get(cat.parent.id);
            if (parentNode) {
                parentNode.subcategories.push(node);
            }
        });

        // 5. Link products to subcategories
        products.forEach(prod => {
            const prodData = {
                id: prod.id,
                name: prod.name,
                price: prod.price,
                slug: prod.slug,
                description: prod.description,
                images: prod.images,
                finacial_service: prod.finacial_service,
                status: prod.status,
                // featured: prod.featured,
                // trending: prod.trending,
                // newArrival: prod.newArrival,
                createdAt: prod.createdAt,
            };

            if (prod.subcategory?.id) {
                const subNode = categoryMap.get(prod.subcategory.id);
                if (subNode) {
                    subNode.products.push(prodData);
                }
            } else if (prod.category?.id) {
                const catNode = categoryMap.get(prod.category.id);
                if (catNode) {
                    if (!catNode.products) catNode.products = [];
                    catNode.products.push(prodData);
                }
            }
        });

        // 6. Group parent categories by Country
        const countryGroupsMap = new Map<string, any[]>();

        parentCategories.forEach(parentCat => {
            const catCountry = parentCat.country || 'Global';
            if (!countryGroupsMap.has(catCountry)) {
                countryGroupsMap.set(catCountry, []);
            }
            countryGroupsMap.get(catCountry).push(parentCat);
        });

        // 7. Format the final output
        const hierarchy: any[] = [];
        countryGroupsMap.forEach((cats, countryName) => {
            hierarchy.push({
                country: countryName,
                categories: cats,
            });
        });

        // 8. If a specific country is requested, filter the result
        if (country) {
            return hierarchy.filter(h => h.country.toLowerCase() === country.toLowerCase());
        }

        return hierarchy;
    }

    async updateHierarchy(categoryId?: number, subcategoryId?: number, productId?: number): Promise<{ message: string }> {
        if (productId) {
            const productRepo = this.categoryRepository.manager.getRepository(Product);
            const product = await productRepo.findOne({ where: { id: productId } });
            if (!product) throw new NotFoundException('Product not found');

            if (categoryId !== undefined) {
                if (categoryId) {
                    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
                    if (!category) throw new NotFoundException('Category not found');
                    product.category = category;
                } else {
                    product.category = null;
                }
            }

            if (subcategoryId !== undefined) {
                if (subcategoryId) {
                    const subcategory = await this.categoryRepository.findOne({ where: { id: subcategoryId } });
                    if (!subcategory) throw new NotFoundException('Subcategory not found');
                    product.subcategory = subcategory;
                } else {
                    product.subcategory = null;
                }
            }

            await productRepo.save(product);
            return { message: 'Product hierarchy updated successfully' };
        } else if (subcategoryId) {
            const subcategory = await this.categoryRepository.findOne({ where: { id: subcategoryId } });
            if (!subcategory) throw new NotFoundException('Subcategory not found');

            if (categoryId !== undefined) {
                if (categoryId) {
                    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
                    if (!category) throw new NotFoundException('Category not found');
                    subcategory.parent = category;
                } else {
                    subcategory.parent = null;
                }
            }

            await this.categoryRepository.save(subcategory);
            return { message: 'Subcategory hierarchy updated successfully' };
        }

        throw new BadRequestException('Must provide either productId or subcategoryId to update');
    }
}