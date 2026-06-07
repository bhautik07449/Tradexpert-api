import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpcomingCollaboration } from "./entities/UpcomingCollaboration.entity";

@Injectable()
export class UpcomingCollaborationService {
    constructor(
        @InjectRepository(UpcomingCollaboration)
        private readonly upcomingcollaborationRepository: Repository<UpcomingCollaboration>
    ) { }

    async create(data: Partial<UpcomingCollaboration>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const upcoming = this.upcomingcollaborationRepository.create(data);
            const saved = await this.upcomingcollaborationRepository.save(upcoming);

            return {
                success: true,
                message: 'Upcoming Collaboration created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Upcoming Collaboration');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.upcomingcollaborationRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Upcoming Collaboration fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Upcoming Collaboration');
        }
    }

    async findOne(id: number) {
        try {
            const upcoming = await this.upcomingcollaborationRepository.findOne({
                where: { id },
            });

            if (!upcoming) {
                throw new NotFoundException('Upcoming Collaboration not found');
            }

            return {
                success: true,
                message: 'Upcoming Collaboration fetched successfully',
                data: upcoming,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<UpcomingCollaboration>) {
        try {
            const upcoming = await this.upcomingcollaborationRepository.findOne({
                where: { id },
            });

            if (!upcoming) {
                throw new NotFoundException('Upcoming Collaboration not found');
            }

            Object.assign(upcoming, data);

            const updated = await this.upcomingcollaborationRepository.save(upcoming);

            return {
                success: true,
                message: 'Upcoming Collaboration updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const upcoming = await this.upcomingcollaborationRepository.findOne({
                where: { id },
            });

            if (!upcoming) {
                throw new NotFoundException('Upcoming Collaboration not found');
            }

            await this.upcomingcollaborationRepository.remove(upcoming);

            return {
                success: true,
                message: 'Upcoming Collaboration deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}