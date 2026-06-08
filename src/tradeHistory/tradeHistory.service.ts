import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { TradeHistory } from "./entities/tradeHistory.entity";

@Injectable()
export class TradeHistoryService {
    constructor(
        @InjectRepository(TradeHistory)
        private readonly tradeHistoryRepository: Repository<TradeHistory>
    ) { }

    async create(data: Partial<TradeHistory>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const tradeHistory = this.tradeHistoryRepository.create(data);
            const saved = await this.tradeHistoryRepository.save(tradeHistory);

            return {
                success: true,
                message: 'Trade History created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Trade History');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country } : {};

            const data = await this.tradeHistoryRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Trade History fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Trade History');
        }
    }

    async findByCountry(country?: string) {
        try {
            const whereClause = country ? { country: country } : { country: IsNull() };
            const data = await this.tradeHistoryRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            if (!data || data.length === 0) {
                throw new NotFoundException('Data not found');
            }

            return {
                success: true,
                message: 'Data fetched successfully',
                data: data,
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            const event = await this.tradeHistoryRepository.findOne({
                where: { id },
            });

            if (!event) {
                throw new NotFoundException('Trade History not found');
            }

            return {
                success: true,
                message: 'Trade History fetched successfully',
                data: event,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<TradeHistory>) {
        try {
            const event = await this.tradeHistoryRepository.findOne({
                where: { id },
            });

            if (!event) {
                throw new NotFoundException('Trade History not found');
            }

            Object.assign(event, data);

            const updated = await this.tradeHistoryRepository.save(event);

            return {
                success: true,
                message: 'Trade History updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const event = await this.tradeHistoryRepository.findOne({
                where: { id },
            });

            if (!event) {
                throw new NotFoundException('Trade History not found');
            }

            await this.tradeHistoryRepository.remove(event);

            return {
                success: true,
                message: 'Trade History deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}