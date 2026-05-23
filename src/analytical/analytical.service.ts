import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Analytical } from "./entities/analytical.entity";

@Injectable()
export class AnalyticalService {
    constructor(
        @InjectRepository(Analytical)
        private readonly analyticalRepository: Repository<Analytical>
    ) { }

    async create(data: Partial<Analytical>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const analyticalData = this.analyticalRepository.create(data);
            const saved = await this.analyticalRepository.save(analyticalData);

            return {
                success: true,
                message: 'Data created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Data');
        }
    }

    async findAll(country?: string) {
        try {
            const whereCondition = country ? { country } : {};

            const data = await this.analyticalRepository.find({
                where: whereCondition,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Data fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Data');
        }
    }

    async findOne(id: number) {
        try {
            const data = await this.analyticalRepository.findOne({
                where: { id },
            });

            if (!data) {
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

    async findByCountry(country?: string) {
        try {
            const whereCondition = country ? { country } : { country: IsNull() };
            const data = await this.analyticalRepository.find({
                where: whereCondition,
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

    async update(id: number, data: Partial<Analytical>) {
        try {
            const existingData = await this.analyticalRepository.findOne({
                where: { id },
            });

            if (!existingData) {
                throw new NotFoundException('Data not found');
            }

            Object.assign(existingData, data);

            const updated = await this.analyticalRepository.save(existingData);

            return {
                success: true,
                message: 'Data updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const data = await this.analyticalRepository.findOne({
                where: { id },
            });

            if (!data) {
                throw new NotFoundException('Data not found');
            }

            await this.analyticalRepository.remove(data);

            return {
                success: true,
                message: 'Data deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}