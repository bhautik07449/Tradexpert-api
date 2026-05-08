import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Abctype } from "./entities/abctype.entity";

@Injectable()
export class AbctypeService {
    constructor(
        @InjectRepository(Abctype)
        private readonly abctypeRepository: Repository<Abctype>
    ) { }

    async create(data: Partial<Abctype>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const abctype = this.abctypeRepository.create(data);
            const saved = await this.abctypeRepository.save(abctype);

            return {
                success: true,
                message: 'Abc Type created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Abc Type');
        }
    }

    async findAll() {
        try {
            const data = await this.abctypeRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Abc Type fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Abc Type');
        }
    }

    async findOne(id: number) {
        try {
            const abctype = await this.abctypeRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Abc Type not found');
            }

            return {
                success: true,
                message: 'Abc Type fetched successfully',
                data: abctype,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Abctype>) {
        try {
            const abctype = await this.abctypeRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Abc Type not found');
            }

            Object.assign(abctype, data);

            const updated = await this.abctypeRepository.save(abctype);

            return {
                success: true,
                message: 'Abc Type updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const abctype = await this.abctypeRepository.findOne({
                where: { id },
            });

            if (!abctype) {
                throw new NotFoundException('Abc Type not found');
            }

            await this.abctypeRepository.remove(abctype);

            return {
                success: true,
                message: 'Abc Type deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}