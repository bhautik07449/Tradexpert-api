import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(Currency)
        private readonly currencyRepo: Repository<Currency>,
    ) { }

    async create(data: Partial<Currency>) {
        try {
            const currency = this.currencyRepo.create(data);
            const saved = await this.currencyRepo.save(currency);

            return {
                success: true,
                message: 'Currency created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create currency');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.currencyRepo.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Currencies fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch currencies');
        }
    }

    async findOne(id: number) {
        try {
            const currency = await this.currencyRepo.findOne({
                where: { id },
            });

            if (!currency) {
                throw new NotFoundException('Currency not found');
            }

            return {
                success: true,
                message: 'Currency fetched successfully',
                data: currency,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Currency>) {
        try {
            const currency = await this.currencyRepo.findOne({
                where: { id },
            });

            if (!currency) {
                throw new NotFoundException('Currency not found');
            }

            Object.assign(currency, data);

            const updated = await this.currencyRepo.save(currency);

            return {
                success: true,
                message: 'Currency updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const currency = await this.currencyRepo.findOne({
                where: { id },
            });

            if (!currency) {
                throw new NotFoundException('Currency not found');
            }

            await this.currencyRepo.remove(currency);

            return {
                success: true,
                message: 'Currency deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}