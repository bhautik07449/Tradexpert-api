import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DevelopPreposition, status } from './entities/develop-preposition.entity';

@Injectable()
export class DevelopPrepositionsService {
    constructor(
        @InjectRepository(DevelopPreposition)
        private developPrepositionRepository: Repository<DevelopPreposition>,
    ) { }

    async create(data: Partial<DevelopPreposition>) {
        try {
            const preposition = this.developPrepositionRepository.create(data);
            const saved = await this.developPrepositionRepository.save(preposition);

            return {
                success: true,
                message: 'Develop Preposition created successfully',
                data: saved,
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const data = await this.developPrepositionRepository.find({
                order: { createdAt: 'DESC' },
                where: { status: Not(status.DELETED) }
            });

            return {
                success: true,
                message: 'Develop Prepositions fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Develop Prepositions');
        }
    }

    async findOne(id: number) {
        try {
            const preposition = await this.developPrepositionRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!preposition) {
                throw new NotFoundException('Develop Preposition not found');
            }

            return {
                success: true,
                message: 'Develop Preposition fetched successfully',
                data: preposition,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<DevelopPreposition>) {
        const preposition = await this.developPrepositionRepository.findOne({
            where: { id, status: Not(status.DELETED) },
        });

        if (!preposition) {
            throw new NotFoundException('Develop Preposition not found');
        }

        Object.assign(preposition, data);

        const updated = await this.developPrepositionRepository.save(preposition);

        return {
            success: true,
            message: 'Develop Preposition updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        try {
            const preposition = await this.developPrepositionRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!preposition) {
                throw new NotFoundException('Develop Preposition not found');
            }

            preposition.status = status.DELETED;
            await this.developPrepositionRepository.save(preposition);

            return {
                success: true,
                message: 'Develop Preposition deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}