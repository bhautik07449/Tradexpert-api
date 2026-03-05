import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Certificationslider } from "./entities/certificationslider.entity";

@Injectable()
export class CertificationsliderService {
    constructor(
        @InjectRepository(Certificationslider)
        private readonly certificationsliderRepository: Repository<Certificationslider>
    ) { }

    async create(data: Partial<Certificationslider>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const certificationslider = this.certificationsliderRepository.create(data);
            const saved = await this.certificationsliderRepository.save(certificationslider);

            return {
                success: true,
                message: 'Certification Slider created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Certification Slider');
        }
    }

    async findAll() {
        try {
            const data = await this.certificationsliderRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Certification Slider fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Certification Slider');
        }
    }

    async findOne(id: number) {
        try {
            const certificationslider = await this.certificationsliderRepository.findOne({
                where: { id },
            });

            if (!certificationslider) {
                throw new NotFoundException('Certification Slider not found');
            }

            return {
                success: true,
                message: 'Certification Slider fetched successfully',
                data: certificationslider,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Certificationslider>) {
        try {
            const certificationslider = await this.certificationsliderRepository.findOne({
                where: { id },
            });

            if (!certificationslider) {
                throw new NotFoundException('Certification Slider not found');
            }

            Object.assign(certificationslider, data);

            const updated = await this.certificationsliderRepository.save(certificationslider);

            return {
                success: true,
                message: 'Certification Slider updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const certificationslider = await this.certificationsliderRepository.findOne({
                where: { id },
            });

            if (!certificationslider) {
                throw new NotFoundException('Certification Slider not found');
            }

            await this.certificationsliderRepository.remove(certificationslider);

            return {
                success: true,
                message: 'Certification Slider deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}