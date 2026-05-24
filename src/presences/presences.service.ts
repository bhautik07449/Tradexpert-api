import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Presences } from "./entities/presences.entity";
import { Category } from "../categories/entities/category.entity";

@Injectable()
export class PresencesService {
    constructor(
        @InjectRepository(Presences)
        private readonly presencesRepository: Repository<Presences>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(data: Partial<Presences>) {
        try {

            if (!data.country) {
                throw new BadRequestException('Country is required');
            }

            const existingPresence = await this.presencesRepository.findOne({
                where: { country: data.country },
            });

            if (existingPresence) {
                throw new BadRequestException(`Presence for country '${data.country}' already exists`);
            }

            const presence = this.presencesRepository.create(data);
            const saved = await this.presencesRepository.save(presence);

            return {
                success: true,
                message: 'Presence created successfully',
                data: saved,
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const data = await this.presencesRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Presences fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch presences');
        }
    }

    async findAllCountry() {
        try {
            const countryResult = await this.categoryRepository
                .createQueryBuilder('category')
                .select('DISTINCT category.country', 'country')
                .where('category.country IS NOT NULL')
                .getRawMany();
            const countries: string[] = countryResult.map((row: any) => row.country);

            return {
                success: true,
                message: 'Presences fetched successfully',
                countries,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch presences');
        }
    }

    async findOne(id: number) {
        try {
            const presence = await this.presencesRepository.findOne({
                where: { id },
            });

            if (!presence) {
                throw new NotFoundException('Presence not found');
            }

            return {
                success: true,
                message: 'Presence fetched successfully',
                data: presence,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Presences>) {
        try {
            const presence = await this.presencesRepository.findOne({
                where: { id },
            });

            if (!presence) {
                throw new NotFoundException('Presence not found');
            }

            if (data.country) {
                const existingPresence = await this.presencesRepository.findOne({
                    where: { country: data.country },
                });

                if (existingPresence && existingPresence.id !== id) {
                    throw new BadRequestException(`Presence for country '${data.country}' already exists`);
                }
            }

            Object.assign(presence, data);

            const updated = await this.presencesRepository.save(presence);

            return {
                success: true,
                message: 'Presence updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const presence = await this.presencesRepository.findOne({
                where: { id },
            });

            if (!presence) {
                throw new NotFoundException('Presence not found');
            }

            await this.presencesRepository.remove(presence);

            return {
                success: true,
                message: 'Presence deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}