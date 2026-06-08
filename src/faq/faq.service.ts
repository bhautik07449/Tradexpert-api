import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Faq } from "./entities/faq.entity";

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepository: Repository<Faq>
    ) { }

    async create(data: Partial<Faq>) {
        try {

            const faq = this.faqRepository.create(data);
            const saved = await this.faqRepository.save(faq);

            return {
                success: true,
                message: 'Faq created successfully',
                data: saved,
            };

        } catch (error) {
            throw error;
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.faqRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Faq fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Faq');
        }
    }

    async findOne(id: number) {
        try {
            const faq = await this.faqRepository.findOne({
                where: { id },
            });

            if (!faq) {
                throw new NotFoundException('Faq not found');
            }

            return {
                success: true,
                message: 'Faq fetched successfully',
                data: faq,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Faq>) {

        const faq = await this.faqRepository.findOne({
            where: { id },
        });

        if (!faq) {
            throw new NotFoundException('Faq not found');
        }

        Object.assign(faq, data);

        const updated = await this.faqRepository.save(faq);

        return {
            success: true,
            message: 'Faq updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        try {
            const faq = await this.faqRepository.findOne({
                where: { id },
            });

            if (!faq) {
                throw new NotFoundException('Faq not found');
            }

            await this.faqRepository.remove(faq);

            return {
                success: true,
                message: 'Faq deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}