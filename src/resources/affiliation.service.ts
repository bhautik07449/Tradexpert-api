import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Affiliation } from "./entities/affiliation.entity";

@Injectable()
export class AffiliationService {
    constructor(
        @InjectRepository(Affiliation)
        private readonly affiliationRepository: Repository<Affiliation>
    ) { }

    async create(data: Partial<Affiliation>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const affiliation = this.affiliationRepository.create(data);
            const saved = await this.affiliationRepository.save(affiliation);

            return {
                success: true,
                message: 'Affiliation Resources created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Affiliation Resources');
        }
    }

    async findAll(country: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.affiliationRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Affiliation Resources fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Affiliation Resources');
        }
    }

    async findOne(id: number) {
        try {
            const affiliation = await this.affiliationRepository.findOne({
                where: { id },
            });

            if (!affiliation) {
                throw new NotFoundException('Affiliation Resources not found');
            }

            return {
                success: true,
                message: 'Affiliation Resources fetched successfully',
                data: affiliation,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Affiliation>) {
        try {
            const affiliation = await this.affiliationRepository.findOne({
                where: { id },
            });

            if (!affiliation) {
                throw new NotFoundException('Affiliation Resources not found');
            }

            Object.assign(affiliation, data);

            const updated = await this.affiliationRepository.save(affiliation);

            return {
                success: true,
                message: 'Affiliation Resources updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const affiliation = await this.affiliationRepository.findOne({
                where: { id },
            });

            if (!affiliation) {
                throw new NotFoundException('Affiliation Resources not found');
            }

            await this.affiliationRepository.remove(affiliation);

            return {
                success: true,
                message: 'Affiliation Resources deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}