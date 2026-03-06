import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quotation } from "./entities/quotation.entity";

@Injectable()
export class QuotationService {
    constructor(
        @InjectRepository(Quotation)
        private readonly quotationRepository: Repository<Quotation>
    ) { }

    async create(data: Partial<Quotation>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const quotation = this.quotationRepository.create(data);
            const saved = await this.quotationRepository.save(quotation);

            return {
                success: true,
                message: 'Quotation created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Quotation');
        }
    }

    async findAll() {
        try {
            const data = await this.quotationRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Quotation fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Quotation');
        }
    }

    async findOne(id: number) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            return {
                success: true,
                message: 'Quotation fetched successfully',
                data: quotation,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Quotation>) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            Object.assign(quotation, data);

            const updated = await this.quotationRepository.save(quotation);

            return {
                success: true,
                message: 'Quotation updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const quotation = await this.quotationRepository.findOne({
                where: { id },
            });

            if (!quotation) {
                throw new NotFoundException('Quotation not found');
            }

            await this.quotationRepository.remove(quotation);

            return {
                success: true,
                message: 'Quotation deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}