import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MarketDevelopment } from "./entities/marketDevelopment.entity";

@Injectable()
export class marketDevelopmentService {
    constructor(
        @InjectRepository(MarketDevelopment)
        private readonly marketDevelopmentRepository: Repository<MarketDevelopment>
    ) { }

    async create(data: Partial<MarketDevelopment>) {
        try {
            if (!data?.market_data) {
                throw new BadRequestException('market data is required');
            }

            const marketDevelopment = this.marketDevelopmentRepository.create(data);
            const saved = await this.marketDevelopmentRepository.save(marketDevelopment);

            return {
                success: true,
                message: 'Market Development created successfully',
                data: saved,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to create Market Development');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = {};
            if (country) {
                whereClause.country = country;
            }
            const data = await this.marketDevelopmentRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Market Development fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Market Development');
        }
    }

    async findOne(id: number) {
        try {
            const marketDevelopment = await this.marketDevelopmentRepository.findOne({
                where: { id },
            });

            if (!marketDevelopment) {
                throw new NotFoundException('Market Development not found');
            }

            return {
                success: true,
                message: 'Market Development fetched successfully',
                data: marketDevelopment,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<MarketDevelopment>) {
        try {
            const marketDevelopment = await this.marketDevelopmentRepository.findOne({
                where: { id },
            });

            if (!marketDevelopment) {
                throw new NotFoundException('Market Development not found');
            }

            Object.assign(marketDevelopment, data);

            const updated = await this.marketDevelopmentRepository.save(marketDevelopment);

            return {
                success: true,
                message: 'Market Development updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const marketDevelopment = await this.marketDevelopmentRepository.findOne({
                where: { id },
            });

            if (!marketDevelopment) {
                throw new NotFoundException('Market Development not found');
            }

            await this.marketDevelopmentRepository.remove(marketDevelopment);

            return {
                success: true,
                message: 'Market Development deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}