import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PolicyPreamble } from "./entities/policypreamble.entity";

@Injectable()
export class PolicyPreambleService {
    constructor(
        @InjectRepository(PolicyPreamble)
        private readonly policypreambleRepository: Repository<PolicyPreamble>
    ) { }

    async create(data: Partial<PolicyPreamble>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const policypreamble = this.policypreambleRepository.create(data);
            const saved = await this.policypreambleRepository.save(policypreamble);

            return {
                success: true,
                message: 'Policy - Preamble & Upcoming Updates created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Policy - Preamble & Upcoming Updates');
        }
    }

    async findAll(country?: string) {
        try {
            const wherecondition = country ? { country: country } : {}

            const data = await this.policypreambleRepository.find({
                where: wherecondition,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Policy - Preamble & Upcoming Updates fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Policy - Preamble & Upcoming Updates');
        }
    }

    async findOne(id: number) {
        try {
            const policypreamble = await this.policypreambleRepository.findOne({
                where: { id },
            });

            if (!policypreamble) {
                throw new NotFoundException('Policy - Preamble & Upcoming Updates not found');
            }

            return {
                success: true,
                message: 'Policy - Preamble & Upcoming Updates fetched successfully',
                data: policypreamble,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<PolicyPreamble>) {
        try {
            const policypreamble = await this.policypreambleRepository.findOne({
                where: { id },
            });

            if (!policypreamble) {
                throw new NotFoundException('Policy - Preamble & Upcoming Updates not found');
            }

            Object.assign(policypreamble, data);

            const updated = await this.policypreambleRepository.save(policypreamble);

            return {
                success: true,
                message: 'Policy - Preamble & Upcoming Updates updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const policypreamble = await this.policypreambleRepository.findOne({
                where: { id },
            });

            if (!policypreamble) {
                throw new NotFoundException('Policy - Preamble & Upcoming Updates not found');
            }

            await this.policypreambleRepository.remove(policypreamble);

            return {
                success: true,
                message: 'Policy - Preamble & Upcoming Updates deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}