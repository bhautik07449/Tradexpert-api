import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
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

        const tradeType = await this.tradeofferRepo.findOne({
            where: { id: body.offer_type }
        })

        if (!tradeType) throw new NotFoundException('Offer not found');

        const product = this.productRepo.create({
            ...body,
            category,
            subcategory,
            measure,
            offer_type: tradeType
        });

        const savedProduct = await this.productRepo.save(product);

        return {
            success: true,
            message: 'Product created successfully',
            data: savedProduct,
        };
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
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.category', 'offer_type.items.subCategory', 'offer_type.items.product'],
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
            relations: ['category', 'subcategory', 'measure', 'dmrs', 'dmrs.market', 'offer_type', 'offer_type.items', 'offer_type.items.product'],
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
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product'],
        });

        if (!products.length) {
            products = await this.productRepo.find({
                where: {
                    subcategory: {
                        slug: slug,
                    },
                },
                relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product'],
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
            relations: ['category', 'subcategory', 'measure', 'offer_type', 'offer_type.items', 'offer_type.items.product'],
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