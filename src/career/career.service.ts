import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Career } from "./entities/career.entity";

@Injectable()
export class CareerService {
    constructor(
        @InjectRepository(Career)
        private readonly careerRepository: Repository<Career>
    ) { }

    async create(data: Partial<Career>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const career = this.careerRepository.create(data);
            const saved = await this.careerRepository.save(career);

            return {
                success: true,
                message: 'Career created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Career');
        }
    }

    async findAll() {
        try {
            const data = await this.careerRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Career fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Career');
        }
    }

    async findOne(id: number) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career not found');
            }

            return {
                success: true,
                message: 'Career fetched successfully',
                data: career,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Career>) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career not found');
            }

            Object.assign(career, data);

            const updated = await this.careerRepository.save(career);

            return {
                success: true,
                message: 'Career updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career Type not found');
            }

            await this.careerRepository.remove(career);

            return {
                success: true,
                message: 'Career deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}