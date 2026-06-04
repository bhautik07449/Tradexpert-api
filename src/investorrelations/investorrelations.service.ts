import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Investorrelations } from "./entities/investorrelations.entity";
import { Product } from "src/product/entities/product.entity";
import { Financial } from "src/financialservice/entities/financialservice.entity";

@Injectable()
export class InvestorrelationsService {
    constructor(
        @InjectRepository(Investorrelations)
        private readonly investorrelationsRepository: Repository<Investorrelations>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Financial)
        private readonly finacialserviceRepository: Repository<Financial>,
    ) { }

    async create(data: Partial<Investorrelations>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: Number(data.product) },
                });

                if (!product) throw new NotFoundException('Product not found');

                data.product = product;
            }

            if (data?.service) {
                const service = await this.finacialserviceRepository.findOne({
                    where: { id: Number(data.service) }
                })

                if (!service) throw new NotFoundException('Product not found');

                data.service = service;
            }

            if (data?.project) {
                const service = await this.finacialserviceRepository.findOne({
                    where: { id: Number(data.project) }
                })

                if (!service) throw new NotFoundException('Project not found');

                data.project = service;
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
                relations: ['product', 'service', 'project']
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

            if (data?.service) {
                const service = await this.finacialserviceRepository.findOne({
                    where: { id: Number(data.service) }
                })

                if (!service) throw new NotFoundException('Product not found');

                data.service = service;
            }

            if (data?.project) {
                const service = await this.finacialserviceRepository.findOne({
                    where: { id: Number(data.project) }
                })

                if (!service) throw new NotFoundException('Project not found');

                data.project = service;
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