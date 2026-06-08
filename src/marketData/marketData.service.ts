import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MarketData } from "./entities/marketData.entity";
import { MarketDevelopment } from "src/markerDevelopment/entities/marketDevelopment.entity";
import { Product } from "src/product/entities/product.entity";
import { Category } from "src/categories/entities/category.entity";

@Injectable()
export class MarketDataService {
    constructor(
        @InjectRepository(MarketData)
        private readonly marketDataRepository: Repository<MarketData>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async create(data: Partial<MarketData>) {
        try {
            const categoryId = (data as any).category;
            const subCategoryId = (data as any).subCategory;
            const productId = (data as any).product;

            if (!data?.budget || !data?.budget_range || !categoryId || !subCategoryId || !productId || !data?.country) {
                throw new BadRequestException('Fill all required fields');
            }

            const category = await this.categoryRepo.findOne({
                where: { id: Number(categoryId) },
            });

            if (!category) throw new NotFoundException('Category not found');

            const subcategory = await this.categoryRepo.findOne({
                where: { id: Number(subCategoryId) },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            const product = await this.productRepo.findOne({
                where: { id: Number(productId) },
            });

            if (!product) throw new NotFoundException('Product not found');

            (data as any).category = category;
            (data as any).subCategory = subcategory;
            (data as any).product = product;
            const marketData = this.marketDataRepository.create(data);
            const saved = await this.marketDataRepository.save(marketData);

            return {
                success: true,
                message: 'Market Data created successfully',
                data: saved,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to create Market Data');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.marketDataRepository.find({
                order: { createdAt: 'DESC' },
                relations: ['category', 'subCategory', 'product', 'product.offer_type', 'product.offer_type.items', 'product.offer_type.items.product'],
                where: whereClause
            });

            return {
                success: true,
                message: 'Market Data fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Market Data');
        }
    }

    async findOne(id: number) {
        try {
            const marketData = await this.marketDataRepository.findOne({
                where: { id },
                relations: ['category', 'subCategory', 'product', 'product.offer_type', 'product.offer_type.items', 'product.offer_type.items.product'],
            });

            if (!marketData) {
                throw new NotFoundException('Market Data not found');
            }

            return {
                success: true,
                message: 'Market Data fetched successfully',
                data: marketData,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<MarketData>) {
        try {
            const marketData = await this.marketDataRepository.findOne({
                where: { id },
            });

            const categoryId = (data as any).category;
            const subCategoryId = (data as any).subCategory;
            const productId = (data as any).product;

            if (!data?.budget || !data?.budget_range || !categoryId || !subCategoryId || !productId || !data?.country) {
                throw new BadRequestException('Fill all required fields');
            }

            const category = await this.categoryRepo.findOne({
                where: { id: Number(categoryId) },
            });

            if (!category) throw new NotFoundException('Category not found');

            const subcategory = await this.categoryRepo.findOne({
                where: { id: Number(subCategoryId) },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            const product = await this.productRepo.findOne({
                where: { id: Number(productId) },
            });

            if (!product) throw new NotFoundException('Product not found');

            (data as any).category = category;
            (data as any).subCategory = subcategory;
            (data as any).product = product;
            Object.assign(marketData, data);

            const updated = await this.marketDataRepository.save(marketData);

            return {
                success: true,
                message: 'Market Data updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const marketData = await this.marketDataRepository.findOne({
                where: { id },
            });

            if (!marketData) {
                throw new NotFoundException('Market Data not found');
            }

            await this.marketDataRepository.remove(marketData);

            return {
                success: true,
                message: 'Market Data deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}