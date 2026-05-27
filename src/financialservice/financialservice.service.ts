import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Financial } from "./entities/financialservice.entity";

@Injectable()
export class FinancialService {
    constructor(
        @InjectRepository(Financial)
        private readonly financialRepository: Repository<Financial>
    ) { }

    async create(data: Partial<Financial>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const Financial = this.financialRepository.create(data);
            const saved = await this.financialRepository.save(Financial);

            return {
                success: true,
                message: 'Financial Service created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Financial Service');
        }
    }

    async findAll() {
        try {
            const data = await this.financialRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Financial Service fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Financial Service');
        }
    }

    async findOne(id: number) {
        try {
            const Financial = await this.financialRepository.findOne({
                where: { id },
            });

            if (!Financial) {
                throw new NotFoundException('Financial Service not found');
            }

            return {
                success: true,
                message: 'Financial Service fetched successfully',
                data: Financial,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Financial>) {
        try {
            const Financial = await this.financialRepository.findOne({
                where: { id },
            });

            if (!Financial) {
                throw new NotFoundException('Financial Service not found');
            }

            Object.assign(Financial, data);

            const updated = await this.financialRepository.save(Financial);

            return {
                success: true,
                message: 'Financial Service updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const Financial = await this.financialRepository.findOne({
                where: { id },
            });

            if (!Financial) {
                throw new NotFoundException('Financial Service not found');
            }

            await this.financialRepository.remove(Financial);

            return {
                success: true,
                message: 'Financial Service deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}