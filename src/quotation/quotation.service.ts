import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quotation } from "./entities/quotation.entity";
import { Category } from "src/categories/entities/category.entity";
import { Measurement } from "src/measurements/entities/measurement.entity";
import { Currency } from "src/currency/entities/currency.entity";
import { Product } from "src/product/entities/product.entity";

@Injectable()
export class QuotationService {
    constructor(
        @InjectRepository(Quotation)
        private readonly quotationRepository: Repository<Quotation>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Measurement)
        private readonly measureRepo: Repository<Measurement>,

        @InjectRepository(Currency)
        private readonly currencyRepo: Repository<Currency>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>
    ) { }

    async create(data: any) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            const category = data.category
                ? await this.categoryRepo.findOne({ where: { id: data.category } })
                : null;

            if (data.category && !category) {
                throw new NotFoundException('Category not found');
            }

            const subCategory = data.subCategory
                ? await this.categoryRepo.findOne({ where: { id: data.subCategory } })
                : null;

            if (data.subCategory && !subCategory) {
                throw new NotFoundException('SubCategory not found');
            }

            const product = data.product
                ? await this.productRepo.findOne({ where: { id: data.product } })
                : null;

            if (data.product && !product) {
                throw new NotFoundException('Product not found');
            }

            const unit = data.unit
                ? await this.measureRepo.findOne({ where: { id: data.unit } })
                : null;

            if (data.unit && !unit) {
                throw new NotFoundException('Measurement not found');
            }

            const currency = data.currency
                ? await this.currencyRepo.findOne({ where: { id: data.currency } })
                : null;

            if (data.currency && !currency) {
                throw new NotFoundException('Currency not found');
            }

            const quotation = this.quotationRepository.create({
                ...data,
                category,
                subCategory,
                product,
                unit,
                currency
            });

            const saved = await this.quotationRepository.save(quotation);

            return {
                success: true,
                message: 'Quotation created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Quotation');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = {};
            if (country) {
                whereClause.country = country;
            }
            const data = await this.quotationRepository.find({
                where: whereClause,
                relations: [
                    "category",
                    "subCategory",
                    "product",
                    "unit",
                    "currency"
                ],
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Quotation fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Quotation');
        }
    }

    async findOne(id: number) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
                relations: [
                    "category",
                    "subCategory",
                    "product",
                    "unit",
                    "currency"
                ],
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            return {
                success: true,
                message: 'Quotation fetched successfully',
                data: quotation,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Quotation>) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            Object.assign(quotation, data);

            const updated = await this.quotationRepository.save(quotation);

            return {
                success: true,
                message: 'Quotation updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            await this.quotationRepository.remove(quotation);

            return {
                success: true,
                message: 'Quotation deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}