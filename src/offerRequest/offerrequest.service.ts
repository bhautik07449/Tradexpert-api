import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';
import { OfferRequest } from './entities/offerrequest.entity';

@Injectable()
export class OfferRequestService {
    constructor(
        @InjectRepository(OfferRequest)
        private readonly offerRepo: Repository<OfferRequest>,

        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,
    ) { }

    async create(data: Partial<OfferRequest>) {
        if (data.trade_offer?.id) {
            const offer = await this.tradeofferRepo.findOne({
                where: { id: data.trade_offer.id },
            });

            if (!offer) throw new NotFoundException('Trade offer not found');

            data.trade_offer = offer;
        }

        const request = this.offerRepo.create(data);
        const saved = await this.offerRepo.save(request);

        return {
            success: true,
            message: 'Offer request created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.offerRepo.find({
            relations: ['trade_offer'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Offer requests fetched successfully',
            data,
        };
    }

    async findOne(id: number) {
        const data = await this.offerRepo.findOne({
            where: { id },
            relations: ['trade_offer'],
        });

        if (!data) throw new NotFoundException('Offer request not found');

        return {
            success: true,
            message: 'Offer request fetched successfully',
            data,
        };
    }

    async update(id: number, body: Partial<OfferRequest>) {
        const request = await this.offerRepo.findOne({
            where: { id },
            relations: ['trade_offer'],
        });

        if (!request)
            throw new NotFoundException('Offer request not found');

        if (body.trade_offer?.id) {
            const offer = await this.tradeofferRepo.findOne({
                where: { id: body.trade_offer.id },
            });

            if (!offer) throw new NotFoundException('Trade offer not found');

            request.trade_offer = offer;
        }

        Object.assign(request, body);

        const updated = await this.offerRepo.save(request);

        return {
            success: true,
            message: 'Offer request updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const request = await this.offerRepo.findOne({
            where: { id },
        });

        if (!request)
            throw new NotFoundException('Offer request not found');

        await this.offerRepo.remove(request);

        return {
            success: true,
            message: 'Offer request deleted successfully',
        };
    }
}