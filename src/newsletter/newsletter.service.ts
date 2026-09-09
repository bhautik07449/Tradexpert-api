import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Newsletter, Status } from "./entities/newsletter.entity";

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter)
        private readonly newsletterRepository: Repository<Newsletter>
    ) { }

    async create(data: Partial<Newsletter>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const currency = this.newsletterRepository.create(data);
            const saved = await this.newsletterRepository.save(currency);

            return {
                success: true,
                message: 'Newsletter created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create newsletter');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = { status: Not(Status.DELETED) };
            if (country) {
                whereClause.country = country;
            }
            const data = await this.newsletterRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Newsletter fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Newsletter');
        }
    }

    async findOne(id: number) {
        try {
            const newsletter = await this.newsletterRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!newsletter) {
                throw new NotFoundException('Currency not found');
            }

            return {
                success: true,
                message: 'Newsletter fetched successfully',
                data: newsletter,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Newsletter>) {
        try {
            const newsletter = await this.newsletterRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!newsletter) {
                throw new NotFoundException('Newsletter not found');
            }

            Object.assign(newsletter, data);

            const updated = await this.newsletterRepository.save(newsletter);

            return {
                success: true,
                message: 'Newsletter updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const newsletter = await this.newsletterRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!newsletter) {
                throw new NotFoundException('Newsletter not found');
            }

            newsletter.status = Status.DELETED;
            await this.newsletterRepository.save(newsletter);

            return {
                success: true,
                message: 'Newsletter deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}