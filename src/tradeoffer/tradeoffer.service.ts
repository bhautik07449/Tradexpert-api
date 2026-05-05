import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tradeoffer } from './entities/tradeoffer.entity';
import { TradeofferItem } from './entities/tradeoffer-item.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class TradeofferService {
    constructor(
        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,

        @InjectRepository(TradeofferItem)
        private readonly itemRepo: Repository<TradeofferItem>,

        @InjectRepository(Tradetype)
        private readonly tradetypeRepo: Repository<Tradetype>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async create(data: any) {
        if (data.trade_type?.id) {
            const tradeType = await this.tradetypeRepo.findOne({
                where: { id: data.trade_type.id },
            });

            if (!tradeType) throw new NotFoundException('Trade type not found');

            data.trade_type = tradeType;
        }

        if (data.items && Array.isArray(data.items)) {
            data.items = await this.validateAndMapItems(data.items);
        }

        const tradeoffer = this.tradeofferRepo.create(data);
        const saved = await this.tradeofferRepo.save(tradeoffer);

        return {
            success: true,
            message: 'Trade offer created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.tradeofferRepo.find({
            relations: ['trade_type', 'items', 'items.category', 'items.subCategory', 'items.product'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Trade offers fetched successfully',
            data,
        };
    }

    async findOne(id: number) {
        const data = await this.tradeofferRepo.findOne({
            where: { id },
            relations: ['trade_type', 'items', 'items.category', 'items.subCategory', 'items.product'],
        });

        if (!data) throw new NotFoundException('Trade offer not found');

        return {
            success: true,
            message: 'Trade offer fetched successfully',
            data,
        };
    }

    async update(id: number, body: any) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id },
            relations: ['trade_type', 'items'],
        });

        if (!tradeoffer)
            throw new NotFoundException('Trade offer not found');

        if (body.trade_type?.id) {
            const tradeType = await this.tradetypeRepo.findOne({
                where: { id: body.trade_type.id },
            });

            if (!tradeType) throw new NotFoundException('Trade type not found');

            tradeoffer.trade_type = tradeType;
        }

        if (body.items && Array.isArray(body.items)) {
            if (tradeoffer.items && tradeoffer.items.length > 0) {
                await this.itemRepo.remove(tradeoffer.items);
            }
            tradeoffer.items = await this.validateAndMapItems(body.items);
        }

        if (body.name) tradeoffer.name = body.name;
        if (body.description) tradeoffer.description = body.description;
        if (body.status) tradeoffer.status = body.status;

        const updated = await this.tradeofferRepo.save(tradeoffer);

        return {
            success: true,
            message: 'Trade offer updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id },
        });

        if (!tradeoffer)
            throw new NotFoundException('Trade offer not found');

        await this.tradeofferRepo.remove(tradeoffer);

        return {
            success: true,
            message: 'Trade offer deleted successfully',
        };
    }

    private async validateAndMapItems(items: any[]) {
        const mappedItems = [];
        for (const item of items) {
            const newItem: any = {
                hsncode: item.hsncode,
                quantity: item.quantity,
                unit_measurement: item.unit_measurement,
                packing_configure: item.packing_configure,
                actual_price: item.actual_price,
                discounted_price: item.discounted_price,
            };

            const getRawId = (obj: any) => {
                if (!obj) return undefined;
                if (typeof obj === 'object') {
                    if (obj.id !== undefined) {
                        return typeof obj.id === 'object' ? obj.id.id : obj.id;
                    }
                    return undefined;
                }
                return obj;
            };

            const categoryId = getRawId(item.category);
            if (categoryId) {
                const category = await this.categoryRepo.findOne({ where: { id: categoryId as any } });
                if (category) newItem.category = category;
            }

            const subCategoryId = getRawId(item.subCategory);
            if (subCategoryId) {
                const subCategory = await this.categoryRepo.findOne({ where: { id: subCategoryId as any } });
                if (subCategory) newItem.subCategory = subCategory;
            }

            const productId = getRawId(item.product);
            if (productId) {
                const product = await this.productRepo.findOne({ where: { id: productId as any } });
                if (product) newItem.product = product;
            }

            mappedItems.push(newItem);
        }
        return mappedItems;
    }

    async getGroupedProductsByTradeoffer(id: number) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id },
            relations: [
                'trade_type',
                'items',
                'items.category',
                'items.subCategory',
                'items.product',
                'items.product.measure',
            ],
        });

        if (!tradeoffer) {
            throw new NotFoundException('Trade offer not found');
        }

        return {
            success: true,
            message: 'Grouped products for trade offer fetched successfully',
            tradeoffer: {
                id: tradeoffer.id,
                name: tradeoffer.name,
                description: tradeoffer.description,
                status: tradeoffer.status,
                trade_type: tradeoffer.trade_type,
            },
            data: {
                trade_type: tradeoffer.trade_type,
                items: tradeoffer.items || []
            },
        };
    }
}
