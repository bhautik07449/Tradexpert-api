import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Membership } from "./entities/membership.entity";

@Injectable()
export class MembershipService {
    constructor(
        @InjectRepository(Membership)
        private readonly membershipRepository: Repository<Membership>
    ) { }

    async create(data: Partial<Membership>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const membership = this.membershipRepository.create(data);
            const saved = await this.membershipRepository.save(membership);

            return {
                success: true,
                message: 'Membership Resources created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Membership Resources');
        }
    }

    async findAll(country: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.membershipRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Membership Resources fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Membership Resources');
        }
    }

    async findOne(id: number) {
        try {
            const membership = await this.membershipRepository.findOne({
                where: { id },
            });

            if (!membership) {
                throw new NotFoundException('Membership Resources not found');
            }

            return {
                success: true,
                message: 'Membership Resources fetched successfully',
                data: membership,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Membership>) {
        try {
            const membership = await this.membershipRepository.findOne({
                where: { id },
            });

            if (!membership) {
                throw new NotFoundException('Membership Resources not found');
            }

            Object.assign(membership, data);

            const updated = await this.membershipRepository.save(membership);

            return {
                success: true,
                message: 'Membership Resources updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const membership = await this.membershipRepository.findOne({
                where: { id },
            });

            if (!membership) {
                throw new NotFoundException('Membership Resources not found');
            }

            await this.membershipRepository.remove(membership);

            return {
                success: true,
                message: 'Membership Resources deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}