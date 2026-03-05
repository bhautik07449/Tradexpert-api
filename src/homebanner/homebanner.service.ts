import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Homebanner } from "./entities/homebanner.entity";

@Injectable()
export class HomebannerService {
    constructor(
        @InjectRepository(Homebanner)
        private readonly homebannerRepository: Repository<Homebanner>
    ) { }

    async create(data: Partial<Homebanner>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
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

    async findOne(id: number) {
        try {
            const homebanner = await this.homebannerRepository.findOne({
                where: { id },
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