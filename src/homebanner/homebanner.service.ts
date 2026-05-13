import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Homebanner } from "./entities/homebanner.entity";
import { Category } from "src/categories/entities/category.entity";

@Injectable()
export class HomebannerService {
    constructor(
        @InjectRepository(Homebanner)
        private readonly homebannerRepository: Repository<Homebanner>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async create(data: Partial<Homebanner>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.category?.id) {
                const category = await this.categoryRepository.findOne({
                    where: { id: data.category.id },
                });

                if (!category) throw new NotFoundException('Blog category not found');

                data.category = category;
            }

            const homebanner = this.homebannerRepository.create(data);
            const saved = await this.homebannerRepository.save(homebanner);

            return {
                success: true,
                message: 'Home Banner created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Home Banner');
        }
    }

    async findAll() {
        try {
            const data = await this.homebannerRepository.find({
                order: { createdAt: 'DESC' },
                relations: ['category'],
            });

            return {
                success: true,
                message: 'Home Banner fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Home Banner');
        }
    }

    async findByCountry(country?: string) {
        try {
            const whereCondition = country ? { country } : { country: IsNull() };
            const data = await this.homebannerRepository.find({
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

    async findByCategory(category: number) {
        try {
            const data = await this.homebannerRepository.find({
                where: {
                    category: {
                        id: Number(category),
                    },
                },
                relations: ['category'],
                order: { createdAt: 'DESC' },
            });

            if (!data || data.length === 0) {
                throw new NotFoundException('Data not found');
            }

            return {
                success: true,
                message: 'Data fetched successfully',
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            const homebanner = await this.homebannerRepository.findOne({
                where: { id },
                relations: ['category'],
            });

            if (!homebanner) {
                throw new NotFoundException('Home Banner not found');
            }

            return {
                success: true,
                message: 'Home Banner fetched successfully',
                data: homebanner,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Homebanner>) {
        try {
            const homebanner = await this.homebannerRepository.findOne({
                where: { id },
            });

            if (!homebanner) {
                throw new NotFoundException('Home Banner not found');
            }

            if (data.category?.id) {
                const category = await this.categoryRepository.findOne({
                    where: { id: data.category.id },
                });

                if (!category) throw new NotFoundException('Blog category not found');

                data.category = category;
            }

            Object.assign(homebanner, data);

            const updated = await this.homebannerRepository.save(homebanner);

            return {
                success: true,
                message: 'Home Banner updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const homebanner = await this.homebannerRepository.findOne({
                where: { id },
            });

            if (!homebanner) {
                throw new NotFoundException('Home Banner not found');
            }

            await this.homebannerRepository.remove(homebanner);

            return {
                success: true,
                message: 'Home Banner deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}