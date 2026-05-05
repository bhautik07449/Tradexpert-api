import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tradeoffer } from './entities/tradeoffer.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class TradeofferService {
    constructor(
        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,

        @InjectRepository(Tradetype)
        private readonly tradetypeRepo: Repository<Tradetype>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async create(data: Partial<Tradeoffer>) {
        if (data.trade_type?.id) {
            const tradeType = await this.tradetypeRepo.findOne({
                where: { id: data.trade_type.id },
            });

            if (!tradeType) throw new NotFoundException('Trade type not found');

            data.trade_type = tradeType;
        }

        await this.validateRelations(data);

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
            relations: ['trade_type', 'category', 'subCategory', 'product'],
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
            relations: ['trade_type', 'category', 'subCategory', 'product'],
        });

        if (!data) throw new NotFoundException('Trade offer not found');

        return {
            success: true,
            message: 'Trade offer fetched successfully',
            data,
        };
    }

    async update(id: number, body: Partial<Tradeoffer>) {
        const tradeoffer = await this.tradeofferRepo.findOne({
            where: { id },
            relations: ['trade_type'],
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

        await this.validateRelations(body);

        Object.assign(tradeoffer, body);

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

    private async validateRelations(data: any) {
        const processIds = async (repo: Repository<any>, values: any) => {
            if (!values) return [];
            const valArray = Array.isArray(values) ? values : [values];
            if (valArray.length === 0) return [];

            const ids = valArray.map((v) => (typeof v === 'object' ? v.id : v)).filter((id) => !!id);
            if (ids.length === 0) return [];

            const uniqueIds = [...new Set(ids)];
            const found = await repo.find({ where: { id: In(uniqueIds) } });
            if (found.length !== uniqueIds.length) {
                throw new NotFoundException(`Some IDs not found in ${repo.metadata.target instanceof Function ? repo.metadata.target.name : repo.metadata.tableName}`);
            }
            return found;
        };

        if (data.category !== undefined) data.category = await processIds(this.categoryRepo, data.category);
        if (data.subCategory !== undefined) data.subCategory = await processIds(this.categoryRepo, data.subCategory);
        if (data.product !== undefined) data.product = await processIds(this.productRepo, data.product);
    }
}
