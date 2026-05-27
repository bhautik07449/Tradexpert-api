import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Investorrelations } from "./entities/investorrelations.entity";

@Injectable()
export class InvestorrelationsService {
    constructor(
        @InjectRepository(Investorrelations)
        private readonly investorrelationsRepository: Repository<Investorrelations>
    ) { }

    async create(data: Partial<Investorrelations>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const Investorrelations = this.investorrelationsRepository.create(data);
            const saved = await this.investorrelationsRepository.save(Investorrelations);

            return {
                success: true,
                message: 'Investor Relations created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Investor Relations');
        }
    }

    async findAll() {
        try {
            const data = await this.investorrelationsRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Investor Relations fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Investor Relations');
        }
    }

    async findOne(id: number) {
        try {
            const abctype = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Investor Relations not found');
            }

            return {
                success: true,
                message: 'Investor Relations fetched successfully',
                data: abctype,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Investorrelations>) {
        try {
            const abctype = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Investor Relations not found');
            }

            Object.assign(abctype, data);

            const updated = await this.investorrelationsRepository.save(abctype);

            return {
                success: true,
                message: 'Investor Relations updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const abctype = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Investor Relations not found');
            }

            await this.investorrelationsRepository.remove(abctype);

            return {
                success: true,
                message: 'Investor Relations deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}