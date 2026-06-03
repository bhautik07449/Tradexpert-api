import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Measurement)
        private readonly measureRepo: Repository<Measurement>,

        @InjectRepository(Tradetype)
        private readonly tradetypeRepo: Repository<Tradetype>,
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

        const measure = await this.measureRepo.findOne({
            where: { id: body.measure },
        });

        if (!measure) throw new NotFoundException('Measurement not found');

        const tradeType = await this.tradetypeRepo.findOne({
            where: { id: body.offer_type }
        })

        if (!tradeType) throw new NotFoundException('Offer not found');

        const product = this.productRepo.create({
            ...body,
            category,
            subcategory,
            measure,
            tradeType
        });

        const savedProduct = await this.productRepo.save(product);

        return {
            success: true,
            message: 'Product created successfully',
            data: savedProduct,
        };
    }

    async findAll(season?: any, category?: any, country?: string) {
        const whereClause: any = {};

        if (season) {
            whereClause.season = season;
        }

        if (category) {
            whereClause.category = { id: category };
        }

        if (country) {
            whereClause.country = country
        }

        const products = await this.productRepo.find({
            where: whereClause,
            relations: ['category', 'subcategory', 'measure', 'offer_type'],
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
            relations: ['category', 'subcategory', 'measure', 'dmrs', 'dmrs.market', 'offer_type'],
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
            relations: ['category', 'subcategory', 'measure', 'offer_type'],
        });

        if (!products.length) {
            products = await this.productRepo.find({
                where: {
                    subcategory: {
                        slug: slug,
                    },
                },
                relations: ['category', 'subcategory', 'measure', 'offer_type'],
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
            relations: ['category', 'subcategory', 'measure', 'offer_type'],
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

        Object.assign(product, body);

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