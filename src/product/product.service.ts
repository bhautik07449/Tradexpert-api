import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Measurement)
        private readonly measureRepo: Repository<Measurement>,

        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,
    ) { }

    async create(body: any) {
        if (Array.isArray(body)) {
            const savedProducts = [];
            const errors = [];
            for (const [index, item] of body.entries()) {
                try {
                    const savedProduct = await this.createSingle(item);
                    savedProducts.push(savedProduct);
                } catch (error) {
                    errors.push({ index, item: item?.name, reason: error.message });
                }
            }
            return {
                success: true,
                message: `${savedProducts.length} Products created successfully. ${errors.length} failed.`,
                data: savedProducts,
                errors: errors.length > 0 ? errors : undefined
            };
        } else {
            const savedProduct = await this.createSingle(body);
            return {
                success: true,
                message: 'Product created successfully',
                data: savedProduct,
            };
        }
    }

    private async createSingle(body: any) {
        if (!body.category) throw new BadRequestException('Category is required');
        const categoryId = Number(body.category);
        const category = await this.categoryRepo.findOne({
            where: isNaN(categoryId) ? { name: body.category } : { id: categoryId },
        });

        if (!category) throw new NotFoundException(`Category not found: ${body.category}`);

        const subCatVal = body.subCategory || body.subcategory;
        if (!subCatVal) throw new BadRequestException('Subcategory is required');
        const subCategoryId = Number(subCatVal);
        const subcategory = await this.categoryRepo.findOne({
            where: isNaN(subCategoryId) ? { name: subCatVal } : { id: subCategoryId },
        });

        if (!subcategory) throw new NotFoundException(`Subcategory not found: ${subCatVal}`);

        if (!body.measure) throw new BadRequestException('Measurement is required');
        const measureId = Number(body.measure);
        const measure = await this.measureRepo.findOne({
            where: isNaN(measureId) ? { name: body.measure } : { id: measureId },
        });

        if (!measure) throw new NotFoundException(`Measurement not found: ${body.measure}`);

        let tradeType = null;
        if (body.offer_type) {
            const offerId = Number(body.offer_type);
            tradeType = await this.tradeofferRepo.findOne({
                where: isNaN(offerId) ? { name: body.offer_type } : { id: offerId }
            });
            if (!tradeType) throw new NotFoundException(`Offer not found: ${body.offer_type}`);
        }

        if (body.finacial_service) {
            if (Array.isArray(body.finacial_service)) {
                body.finacial_service = body.finacial_service.map(id => typeof id === 'object' ? id : { id: Number(id) });
            } else {
                body.finacial_service = [{ id: Number(body.finacial_service) }];
            }
        }

        const product = this.productRepo.create({
            ...body,
            category,
            subcategory,
            measure,
            offer_type: tradeType
        });

        const savedProduct = await this.productRepo.save(product);

        return savedProduct;
    }

    async findAll(season?: any, category?: any, country?: string, subcategory?: any) {
        const whereClause: any = {};

        if (season) {
            whereClause.season = season;
        }

        if (category) {
            whereClause.category = { id: Number(category) };
        }

        if (subcategory) {
            whereClause.subcategory = { id: Number(subcategory) };
        }

        if (country) {
            whereClause.country = country;
        }

        const products = await this.productRepo.find({
            where: whereClause,
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.category', 'offer_type.items.subCategory', 'offer_type.items.product', 'finacial_service'],
            order: { id: 'DESC' },
        });

        if (!products.length) {
            throw new NotFoundException('No data found');
        }

        return {
            success: true,
            message: 'Product list fetched successfully',
            data: products,
        };
    }

    async findOne(id: number) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'measure', 'dmrs', 'dmrs.market', 'offer_type', 'offer_type.items', 'offer_type.items.product', 'finacial_service'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return {
            success: true,
            message: 'Product fetched successfully',
            data: product,
        };
    }

    async findBycat(slug: string) {
        let products = await this.productRepo.find({
            where: {
                category: {
                    slug: slug,
                },
            },
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product', 'finacial_service'],
        });

        if (!products.length) {
            products = await this.productRepo.find({
                where: {
                    subcategory: {
                        slug: slug,
                    },
                },
                relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product', 'finacial_service'],
            });
        }

        if (!products.length) {
            throw new NotFoundException('No products found for this category or subcategory');
        }

        return {
            success: true,
            message: 'Products fetched successfully',
            data: products,
        };
    }

    async update(id: number, body: any) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product', 'finacial_service'],
        });

        if (!product) throw new NotFoundException('Product not found');

        if (body.category) {
            const category = await this.categoryRepo.findOne({
                where: { id: body.category },
            });

            if (!category) throw new NotFoundException('Category not found');

            product.category = category;
        }

        if (body.subCategory) {
            const subcategory = await this.categoryRepo.findOne({
                where: { id: body.subCategory },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            product.subcategory = subcategory;
        }

        if (body.measure) {
            const measure = await this.measureRepo.findOne({
                where: { id: body.measure },
            });

            if (!measure) throw new NotFoundException('Measurement not found');

            product.measure = measure;
        }

        if (body.offer_type) {
            const tradeType = await this.tradeofferRepo.findOne({
                where: { id: body.offer_type },
            });

            if (!tradeType) throw new NotFoundException('Offer not found');

            product.offer_type = tradeType;
        }

        if (body.finacial_service) {
            if (Array.isArray(body.finacial_service)) {
                body.finacial_service = body.finacial_service.map(id => typeof id === 'object' ? id : { id: Number(id) });
            } else {
                body.finacial_service = [{ id: Number(body.finacial_service) }];
            }
        }

        // Remove relation IDs from body so Object.assign doesn't overwrite the resolved entities
        const { category, subCategory, measure, offer_type, ...restBody } = body;
        Object.assign(product, restBody);

        const updatedProduct = await this.productRepo.save(product);

        return {
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        };
    }

    async delete(id: number) {
        const product = await this.productRepo.findOne({
            where: { id },
        });

        if (!product) throw new NotFoundException('Product not found');

        await this.productRepo.remove(product);

        return {
            success: true,
            message: 'Product deleted successfully',
        };
    }
}