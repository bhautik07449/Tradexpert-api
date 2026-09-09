import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Franchise, Status } from "./entities/franchise.entity";

@Injectable()
export class FranchiseService {
    constructor(
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>
    ) { }

    async create(data: Partial<Franchise>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const franchise = this.franchiseRepository.create(data);
            const saved = await this.franchiseRepository.save(franchise);

            return {
                success: true,
                message: 'Franchise created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Franchise');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = country ? { country: country, status: Not(Status.DELETED) } : { status: Not(Status.DELETED) };

            const data = await this.franchiseRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Franchise fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Franchise');
        }
    }

    async findOne(id: number) {
        try {
            const franchise = await this.franchiseRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!franchise) {
                throw new NotFoundException('Franchise not found');
            }

            return {
                success: true,
                message: 'Franchise fetched successfully',
                data: franchise,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Franchise>) {
        try {
            const franchise = await this.franchiseRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!franchise) {
                throw new NotFoundException('Franchise not found');
            }

            Object.assign(franchise, data);

            const updated = await this.franchiseRepository.save(franchise);

            return {
                success: true,
                message: 'Franchise updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const franchise = await this.franchiseRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!franchise) {
                throw new NotFoundException('Franchise not found');
            }

            franchise.status = Status.DELETED;
            await this.franchiseRepository.save(franchise);

            return {
                success: true,
                message: 'Franchise deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}