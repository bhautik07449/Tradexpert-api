import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Multilingual } from "./entities/Multilingual.entity";

@Injectable()
export class MultilingualService {
    constructor(
        @InjectRepository(Multilingual)
        private readonly multilingualRepository: Repository<Multilingual>
    ) { }

    async create(data: Partial<Multilingual>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const multilingual = this.multilingualRepository.create(data);
            const saved = await this.multilingualRepository.save(multilingual);

            return {
                success: true,
                message: 'Multilingual created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Multilingual');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.multilingualRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Multilingual fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Multilingual');
        }
    }

    async findOne(id: number) {
        try {
            const multilingual = await this.multilingualRepository.findOne({
                where: { id },
            });

            if (!multilingual) {
                throw new NotFoundException('Multilingual not found');
            }

            return {
                success: true,
                message: 'Multilingual fetched successfully',
                data: multilingual,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Multilingual>) {
        try {
            const multilingual = await this.multilingualRepository.findOne({
                where: { id },
            });

            if (!multilingual) {
                throw new NotFoundException('Multilingual not found');
            }

            Object.assign(multilingual, data);

            const updated = await this.multilingualRepository.save(multilingual);

            return {
                success: true,
                message: 'Multilingual updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const multilingual = await this.multilingualRepository.findOne({
                where: { id },
            });

            if (!multilingual) {
                throw new NotFoundException('Multilingual not found');
            }

            await this.multilingualRepository.remove(multilingual);

            return {
                success: true,
                message: 'Multilingual deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}