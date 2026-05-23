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
            if (!data?.budget || !data?.budget_range || !data?.category_id || !data?.sub_category_id || !data?.product_id || !data?.country) {
                throw new BadRequestException('Fill all required fields');
            }

            const category = await this.categoryRepo.findOne({
                where: { id: Number(data.category_id) },
            });

            if (!category) throw new NotFoundException('Category not found');

            const subcategory = await this.categoryRepo.findOne({
                where: { id: Number(data.sub_category_id) },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            const product = await this.productRepo.findOne({
                where: { id: Number(data.product_id) },
            });

            if (!product) throw new NotFoundException('Product not found');

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

    async findAll() {
        try {
            const data = await this.marketDataRepository.find({
                order: { createdAt: 'DESC' },
                relations: ['category_id', 'sub_category_id', 'product_id'],
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
                relations: ['category_id', 'sub_category_id', 'product_id'],
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

            if (!data?.budget || !data?.budget_range || !data?.category_id || !data?.sub_category_id || !data?.product_id || !data?.country) {
                throw new BadRequestException('Fill all required fields');
            }

            const category = await this.categoryRepo.findOne({
                where: { id: Number(data.category_id) },
            });

            if (!category) throw new NotFoundException('Category not found');

            const subcategory = await this.categoryRepo.findOne({
                where: { id: Number(data.sub_category_id) },
            });

            if (!subcategory) throw new NotFoundException('Subcategory not found');

            const product = await this.productRepo.findOne({
                where: { id: Number(data.product_id) },
            });

            if (!product) throw new NotFoundException('Product not found');

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