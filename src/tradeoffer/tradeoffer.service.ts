import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tradeoffer } from './entities/tradeoffer.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';

@Injectable()
export class TradeofferService {
    constructor(
        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,

        @InjectRepository(Tradetype)
        private readonly tradetypeRepo: Repository<Tradetype>,
    ) { }

    async create(data: Partial<Tradeoffer>) {
        if (data.trade_type?.id) {
            const tradeType = await this.tradetypeRepo.findOne({
                where: { id: data.trade_type.id },
            });

            if (!tradeType) throw new NotFoundException('Trade type not found');

            data.trade_type = tradeType;
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
            relations: ['trade_type'],
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
            relations: ['trade_type'],
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
}