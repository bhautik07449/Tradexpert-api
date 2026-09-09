import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Tradeoffer, TradeofferStatus } from './entities/tradeoffer.entity';
import { TradeofferItem } from './entities/tradeoffer-item.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Franchise } from 'src/franchise/entities/franchise.entity';

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

        @InjectRepository(Franchise)
        private readonly franchiseRepo: Repository<Franchise>,
    ) { }

    private formatTradeofferResponse(tradeoffer: any) {
        if (!tradeoffer) return tradeoffer;

        const typeName = tradeoffer.trade_type?.name?.toLowerCase() || '';
        const items = tradeoffer.items || [];

        const formatted = { ...tradeoffer };
        delete formatted.items;

        if (typeName.includes('dealer') || typeName.includes('franchise')) {
            formatted.dealer = items;
        } else if (typeName.includes('tender')) {
            formatted.tender = items;
        } else if (typeName.includes('association') || typeName.includes('join')) {
            formatted.association = items;
        } else {
            formatted.ready_stock = items;
        }

        return formatted;
    }

    async create(data: any) {
        if (data.trade_type?.id) {
            const tradeType = await this.tradetypeRepo.findOne({
                where: { id: data.trade_type.id },
            });

            if (!tradeType) throw new NotFoundException('Trade type not found');

            data.trade_type = tradeType;
        }

        const payloadItems = data.dealer || data.tender || data.association || data.ready_stock || data.items;
        if (payloadItems && Array.isArray(payloadItems)) {
            data.items = await this.validateAndMapItems(payloadItems);
        }

        const tradeoffer = this.tradeofferRepo.create(data);
        const saved = await this.tradeofferRepo.save(tradeoffer);

        return {
            success: true,
            message: 'Trade offer created successfully',
            data: this.formatTradeofferResponse(saved),
        };
    }

    async findAll(country?: string) {
        const whereClause: any = country ? { country: country } : {};
        whereClause.status = Not(TradeofferStatus.DELETED);

        const data = await this.tradeofferRepo.find({
            relations: ['trade_type', 'items', 'items.category', 'items.subCategory', 'items.product', 'items.franchise_type'],
            order: { createdAt: 'DESC' },
            where: whereClause
        });

        return {
            success: true,
            message: 'Trade offers fetched successfully',
            data: data.map(t => this.formatTradeofferResponse(t)),
        };
    }

    async findAllByCountry(country: string) {
        const data = await this.tradeofferRepo.find({
            where: { country, status: Not(TradeofferStatus.DELETED) },
            relations: ['trade_type', 'items', 'items.category', 'items.subCategory', 'items.product', 'items.franchise_type'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Trade offers fetched successfully',
            data: data.map(t => this.formatTradeofferResponse(t)),
        };
    }

    async findOne(id: number) {
        const data = await this.tradeofferRepo.findOne({
            where: { id, status: Not(TradeofferStatus.DELETED) },
            relations: ['trade_type', 'items', 'items.category', 'items.subCategory', 'items.product', 'items.franchise_type'],
        });

        if (!data) throw new NotFoundException('Trade offer not found');

        return {
            success: true,
            message: 'Trade offer fetched successfully',
            data: this.formatTradeofferResponse(data),
        };
    }

    async update(id: number, body: any) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id, status: Not(TradeofferStatus.DELETED) },
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

        const bodyItems = body.dealer || body.tender || body.association || body.ready_stock || body.items;
        if (bodyItems && Array.isArray(bodyItems)) {
            if (tradeoffer.items && tradeoffer.items.length > 0) {
                await this.itemRepo.remove(tradeoffer.items);
            }
            tradeoffer.items = await this.validateAndMapItems(bodyItems);
        }

        if (body.name) tradeoffer.name = body.name;
        if (body.description) tradeoffer.description = body.description;
        if (body.country) tradeoffer.country = body.country;
        if (body.status) tradeoffer.status = body.status;

        const updated = await this.tradeofferRepo.save(tradeoffer);

        return {
            success: true,
            message: 'Trade offer updated successfully',
            data: this.formatTradeofferResponse(updated),
        };
    }

    async remove(id: number) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id, status: Not(TradeofferStatus.DELETED) },
        });

        if (!tradeoffer)
            throw new NotFoundException('Trade offer not found');

        tradeoffer.status = TradeofferStatus.DELETED;
        await this.tradeofferRepo.save(tradeoffer);

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
                
                franchise_type: item.franchise_type,
                image: item.image,
                video: item.video,
                profile: item.profile,
                financials: item.financials,

                tender_level: item.tender_level,
                govt_private: item.govt_private,
                department: item.department,
                extra_info: item.extra_info,
                description: item.description,

                state: item.state,
                city: item.city,
                association_image: item.association_image,
                company_type: item.company_type,
                opportunity: item.opportunity,
                company_name: item.company_name,
                status: item.status,
                eoi: item.eoi,
                mou: item.mou,
                moa: item.moa,
                mois: item.mois,
                track_progress: item.track_progress,
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

            const franchiseId = getRawId(item.franchise_type);
            if (franchiseId) {
                const franchise = await this.franchiseRepo.findOne({ where: { id: franchiseId as any } });
                if (franchise) newItem.franchise_type = franchise;
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
                'items.franchise_type',
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
            data: this.formatTradeofferResponse({
                trade_type: tradeoffer.trade_type,
                items: tradeoffer.items || []
            }),
        };
    }
}
