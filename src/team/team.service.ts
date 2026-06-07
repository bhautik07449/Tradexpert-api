import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./entities/team.entity";

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>
    ) { }

    async create(data: Partial<Team>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const team = this.teamRepository.create(data);
            const saved = await this.teamRepository.save(team);

            return {
                success: true,
                message: 'Team created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Team');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.teamRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Team fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Team');
        }
    }

    async findOne(id: number) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id },
            });

            if (!team) {
                throw new NotFoundException('Team not found');
            }

            return {
                success: true,
                message: 'Team fetched successfully',
                data: team,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Team>) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id },
            });

            if (!team) {
                throw new NotFoundException('Team not found');
            }

            Object.assign(team, data);

            const updated = await this.teamRepository.save(team);

            return {
                success: true,
                message: 'Team updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id },
            });

            if (!team) {
                throw new NotFoundException('Team not found');
            }

            await this.teamRepository.remove(team);

            return {
                success: true,
                message: 'Team deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}