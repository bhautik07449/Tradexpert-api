import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IRProject } from "./entities/IRProject.entity";

@Injectable()
export class IRProjectService {
    constructor(
        @InjectRepository(IRProject)
        private readonly IRProjectRepository: Repository<IRProject>
    ) { }

    async create(data: Partial<IRProject>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.finacial_service) {
                if (Array.isArray(data.finacial_service)) {
                    data.finacial_service = data.finacial_service.map((id: any) => typeof id === 'object' ? id : { id: Number(id) }) as any;
                } else {
                    data.finacial_service = [{ id: Number(data.finacial_service) }] as any;
                }
            }

            const project = this.IRProjectRepository.create(data);
            const saved = await this.IRProjectRepository.save(project);

            return {
                success: true,
                message: 'Project created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Project');
        }
    }

    async findAll(country?: string, category?: string) {
        try {
            const whereClause: any = {}

            if (country) {
                whereClause.country = country;
            }
            if (category) {
                whereClause.category = { id: Number(category) };
            }

            const data = await this.IRProjectRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause,
                relations: ['category', 'subcategory', 'finacial_service']
            });

            return {
                success: true,
                message: 'Project fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Project');
        }
    }

    async findOne(id: number) {
        try {
            const project = await this.IRProjectRepository.findOne({
                where: { id },
                relations: ['category', 'subcategory', 'finacial_service']
            });

            if (!project) {
                throw new NotFoundException('Project not found');
            }

            return {
                success: true,
                message: 'Project fetched successfully',
                data: project,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<IRProject>) {
        try {
            const project = await this.IRProjectRepository.findOne({
                where: { id },
            });

            if (!project) {
                throw new NotFoundException('Project not found');
            }

            if (data.finacial_service) {
                if (Array.isArray(data.finacial_service)) {
                    data.finacial_service = data.finacial_service.map((id: any) => typeof id === 'object' ? id : { id: Number(id) }) as any;
                } else {
                    data.finacial_service = [{ id: Number(data.finacial_service) }] as any;
                }
            }

            Object.assign(project, data);

            const updated = await this.IRProjectRepository.save(project);

            return {
                success: true,
                message: 'Project updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const project = await this.IRProjectRepository.findOne({
                where: { id },
            });

            if (!project) {
                throw new NotFoundException('Project not found');
            }

            await this.IRProjectRepository.remove(project);

            return {
                success: true,
                message: 'Project deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}