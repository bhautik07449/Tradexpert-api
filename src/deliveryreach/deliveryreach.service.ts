import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryReach } from "./entities/deliveryreach.entity";

@Injectable()
export class DeliveryReachService {
    constructor(
        @InjectRepository(DeliveryReach)
        private readonly deliveryreachRepository: Repository<DeliveryReach>
    ) { }

    async create(data: Partial<DeliveryReach>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (!data.country) {
                throw new BadRequestException('Country is required');
            }

            const existingPresence = await this.deliveryreachRepository.findOne({
                where: { country: data.country },
            });

            if (existingPresence) {
                throw new BadRequestException(`Presence for country '${data.country}' already exists`);
            }

            const deliveryreach = this.deliveryreachRepository.create(data);
            const saved = await this.deliveryreachRepository.save(deliveryreach);

            return {
                success: true,
                message: 'Delivery Reach created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Delivery Reach');
        }
    }

    async findAll(country?: string) {
        try {
            const whereCondition = country ? { country: country } : {}

            const data = await this.deliveryreachRepository.find({
                where: whereCondition,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Delivery Reach fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Delivery Reach');
        }
    }

    async findOne(id: number) {
        try {
            const data = await this.deliveryreachRepository.findOne({
                where: { id },
            });

            if (!data) {
                throw new NotFoundException('Delivery Reach not found');
            }

            return {
                success: true,
                message: 'Delivery Reach fetched successfully',
                data: data,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<DeliveryReach>) {
        try {
            const deliveryreach = await this.deliveryreachRepository.findOne({
                where: { id },
            });

            if (!deliveryreach) {
                throw new NotFoundException('Delivery Reach not found');
            }

            if (data.country) {
                const existingPresence = await this.deliveryreachRepository.findOne({
                    where: { country: data.country },
                });

                if (existingPresence && existingPresence.id !== id) {
                    throw new BadRequestException(`Presence for country '${data.country}' already exists`);
                }
            }

            Object.assign(deliveryreach, data);

            const updated = await this.deliveryreachRepository.save(deliveryreach);

            return {
                success: true,
                message: 'Delivery Reach updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const data = await this.deliveryreachRepository.findOne({
                where: { id },
            });

            if (!data) {
                throw new NotFoundException('Delivery Reach not found');
            }

            await this.deliveryreachRepository.remove(data);

            return {
                success: true,
                message: 'Delivery Reach deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}