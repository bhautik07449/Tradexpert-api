import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tradetype } from "./entities/tradetype.entity";

@Injectable()
export class TradetypeService {
    constructor(
        @InjectRepository(Tradetype)
        private readonly tradetypeRepository: Repository<Tradetype>
    ) { }

    async create(data: Partial<Tradetype>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const tradetype = this.tradetypeRepository.create(data);
            const saved = await this.tradetypeRepository.save(tradetype);

            return {
                success: true,
                message: 'Trade Type created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Trade Type');
        }
    }

    async findAll() {
        try {
            const data = await this.tradetypeRepository.find({
                order: { createdAt: 'DESC' },
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