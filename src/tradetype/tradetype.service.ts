import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tradetype } from "./entities/tradetype.entity";
import { Tradeoffer } from "src/tradeoffer/entities/tradeoffer.entity";

@Injectable()
export class TradetypeService {
    constructor(
        @InjectRepository(Tradetype)
        private readonly tradetypeRepository: Repository<Tradetype>,
        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepository: Repository<Tradeoffer>
    ) { }

    async create(data: Partial<Tradetype>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const tradetype = this.tradetypeRepository.create(data);
            const saved = await this.tradetypeRepository.save(tradetype);

            const tradeoffer = this.tradeofferRepository.create({
                trade_type: { id: saved.id } as any,
                name: saved.name,
                description: `Auto-generated trade offer for ${saved.name}`,
                country: saved.country,
                items: [],
            });
            await this.tradeofferRepository.save(tradeoffer);

            return {
                success: true,
                message: 'Trade Type created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Trade Type');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.tradetypeRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Trade Type fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Trade Type');
        }
    }

    async findOne(id: number) {
        try {
            const tradetype = await this.tradetypeRepository.findOne({
                where: { id },
            });

            if (!tradetype) {
                throw new NotFoundException('Trade Type not found');
            }

            return {
                success: true,
                message: 'Trade Type fetched successfully',
                data: tradetype,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Tradetype>) {
        try {
            const tradetype = await this.tradetypeRepository.findOne({
                where: { id },
            });

            if (!tradetype) {
                throw new NotFoundException('Trade Type not found');
            }

            Object.assign(tradetype, data);

            const updated = await this.tradetypeRepository.save(tradetype);

            return {
                success: true,
                message: 'Trade Type updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const tradetype = await this.tradetypeRepository.findOne({
                where: { id },
            });

            if (!tradetype) {
                throw new NotFoundException('Trade Type not found');
            }

            await this.tradetypeRepository.remove(tradetype);

            return {
                success: true,
                message: 'Trade Type deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}