import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement, MeasurementStatus } from './entities/measurement.entity';

@Injectable()
export class MeasurementService {
    constructor(
        @InjectRepository(Measurement)
        private readonly measurementRepo: Repository<Measurement>,
    ) { }

    async create(data: Partial<Measurement>) {
        try {
            const measurement = this.measurementRepo.create(data);
            const saved = await this.measurementRepo.save(measurement);

            return {
                success: true,
                message: 'Measurement created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to create measurement',
            );
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.measurementRepo.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Measurements fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch measurements',
            );
        }
    }

    async findOne(id: number) {
        const measurement = await this.measurementRepo.findOne({
            where: { id },
        });

        if (!measurement || measurement.status === MeasurementStatus.DELETED) {
            throw new NotFoundException('Measurement not found');
        }

        return {
            success: true,
            message: 'Measurement fetched successfully',
            data: measurement,
        };
    }

    async update(id: number, data: Partial<Measurement>) {
        const measurement = await this.measurementRepo.findOne({
            where: { id },
        });

        if (!measurement || measurement.status === MeasurementStatus.DELETED) {
            throw new NotFoundException('Measurement not found');
        }

        Object.assign(measurement, data);

        const updated = await this.measurementRepo.save(measurement);

        return {
            success: true,
            message: 'Measurement updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const measurement = await this.measurementRepo.findOne({
            where: { id },
        });

        if (!measurement) {
            throw new NotFoundException('Measurement not found');
        }

        measurement.status = MeasurementStatus.DELETED;
        await this.measurementRepo.save(measurement);

        return {
            success: true,
            message: 'Measurement deleted successfully',
        };
    }
}