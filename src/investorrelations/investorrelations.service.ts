import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Investorrelations } from "./entities/investorrelations.entity";
import { Product } from "src/product/entities/product.entity";

@Injectable()
export class InvestorrelationsService {
    constructor(
        @InjectRepository(Investorrelations)
        private readonly investorrelationsRepository: Repository<Investorrelations>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(data: Partial<Investorrelations>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: data.product.id },
                });

                if (!product) throw new NotFoundException('Product not found');

                data.product = product;
            }

            const Investorrelations = this.investorrelationsRepository.create(data);
            const saved = await this.investorrelationsRepository.save(Investorrelations);

            return {
                success: true,
                message: 'Inquiry Send successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to Inquiry Send');
        }
    }

    async findAll() {
        try {
            const data = await this.investorrelationsRepository.find({
                order: { createdAt: 'DESC' },
                relations: ['product']
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
            const Investorrelations = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!Investorrelations) {
                throw new NotFoundException('Investor Relations not found');
            }

            return {
                success: true,
                message: 'Investor Relations fetched successfully',
                data: Investorrelations,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Investorrelations>) {
        try {
            const Investorrelations = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!Investorrelations) {
                throw new NotFoundException('Investor Relations not found');
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: data.product.id },
                });

                if (!product) throw new NotFoundException('Product not found');

                data.product = product;
            }

            Object.assign(Investorrelations, data);

            const updated = await this.investorrelationsRepository.save(Investorrelations);

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
            const Investorrelations = await this.investorrelationsRepository.findOne({
                where: { id },
            });

            if (!Investorrelations) {
                throw new NotFoundException('Investor Relations not found');
            }

            await this.investorrelationsRepository.remove(Investorrelations);

            return {
                success: true,
                message: 'Investor Relations deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}