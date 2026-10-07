import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DevelopTopology, status } from './entities/develop-topology.entity';

@Injectable()
export class DevelopTopologiesService {
    constructor(
        @InjectRepository(DevelopTopology)
        private developTopologyRepository: Repository<DevelopTopology>,
    ) { }

    async create(data: Partial<DevelopTopology>) {
        try {
            const topology = this.developTopologyRepository.create(data);
            const saved = await this.developTopologyRepository.save(topology);

            return {
                success: true,
                message: 'Develop Topology created successfully',
                data: saved,
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const data = await this.developTopologyRepository.find({
                order: { createdAt: 'DESC' },
                where: { status: Not(status.DELETED) },
                relations: ['preposition', 'candidate']
            });

            return {
                success: true,
                message: 'Develop Topologies fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Develop Topologies');
        }
    }

    async findOne(id: number) {
        try {
            const topology = await this.developTopologyRepository.findOne({
                where: { id, status: Not(status.DELETED) },
                relations: ['preposition', 'candidate']
            });

            if (!topology) {
                throw new NotFoundException('Develop Topology not found');
            }

            return {
                success: true,
                message: 'Develop Topology fetched successfully',
                data: topology,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<DevelopTopology>) {
        const topology = await this.developTopologyRepository.findOne({
            where: { id, status: Not(status.DELETED) },
        });

        if (!topology) {
            throw new NotFoundException('Develop Topology not found');
        }

        Object.assign(topology, data);

        const updated = await this.developTopologyRepository.save(topology);

        return {
            success: true,
            message: 'Develop Topology updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        try {
            const topology = await this.developTopologyRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!topology) {
                throw new NotFoundException('Develop Topology not found');
            }

            topology.status = status.DELETED;
            await this.developTopologyRepository.save(topology);

            return {
                success: true,
                message: 'Develop Topology deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}