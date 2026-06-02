import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ESG } from "./entities/ESG.entity";
import { Category } from "src/categories/entities/category.entity";

@Injectable()
export class ESGService {
    constructor(
        @InjectRepository(ESG)
        private readonly esgRepository: Repository<ESG>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(data: Partial<ESG>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.category) {
                const category = await this.categoryRepository.findOne({
                    where: { id: Number(data.category) }
                });
                if (!category) {
                    throw new BadRequestException('Category not found');
                }
            }

            const esg = this.esgRepository.create(data);
            const saved = await this.esgRepository.save(esg);

            return {
                success: true,
                message: 'ESG created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create ESG');
        }
    }

    async findAll(country?: string, category?: string, tag?: string) {
        try {
            let whereCondition: any = {};

            if (country) {
                whereCondition.country = country;
            }
            if (category) {
                whereCondition.category = { id: Number(category) };
            }

            if (tag) {
                whereCondition.tag = tag;
            }

            const data = await this.esgRepository.find({
                where: whereCondition,
                order: { createdAt: 'DESC' },
                relations: ['category']
            });

            return {
                success: true,
                message: 'ESG fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch ESG');
        }
    }

    async findAllGrouped(country?: string, category?: string) {
        try {
            let whereCondition: any = {};

            if (country) {
                whereCondition.country = country;
            }
            if (category) {
                whereCondition.category = { id: Number(category) };
            }

            const data = await this.esgRepository.find({
                where: whereCondition,
                order: { createdAt: 'DESC' },
                relations: ['category']
            });

            const groupedData: Record<string, ESG[]> = {
                environment: [],
                social: [],
                governance: [],
            };

            data.forEach(item => {
                let tag = item.tag ? item.tag.toLowerCase() : 'other';
                
                if (!groupedData[tag]) {
                    groupedData[tag] = [];
                }
                groupedData[tag].push(item);
            });

            return {
                success: true,
                message: 'ESG fetched and grouped successfully',
                data: groupedData,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch grouped ESG');
        }
    }

    async findOne(id: number) {
        try {
            const esg = await this.esgRepository.findOne({
                where: { id },
                relations: ['category']
            });

            if (!esg) {
                throw new NotFoundException('ESG not found');
            }

            return {
                success: true,
                message: 'ESG fetched successfully',
                data: esg,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<ESG>) {
        try {
            const esg = await this.esgRepository.findOne({
                where: { id },
                relations: ['category']
            });

            if (!esg) {
                throw new NotFoundException('ESG not found');
            }

            if (data.category) {
                const category = await this.categoryRepository.findOne({
                    where: { id: Number(data.category) },
                });
                if (!category) {
                    throw new BadRequestException('Category not found');
                }
            }

            Object.assign(esg, data);

            const updated = await this.esgRepository.save(esg);

            return {
                success: true,
                message: 'ESG updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const esg = await this.esgRepository.findOne({
                where: { id },
            });

            if (!esg) {
                throw new NotFoundException('ESG not found');
            }

            await this.esgRepository.remove(esg);

            return {
                success: true,
                message: 'ESG deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}