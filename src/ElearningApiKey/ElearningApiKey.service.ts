import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElearningApiKey } from "./entities/ElearningApiKey.entity";

@Injectable()
export class ElearningApiKeyService {
    constructor(
        @InjectRepository(ElearningApiKey)
        private readonly apikeyRepository: Repository<ElearningApiKey>
    ) { }

    async create(data: Partial<ElearningApiKey>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const apikey = this.apikeyRepository.create(data);
            const saved = await this.apikeyRepository.save(apikey);

            return {
                success: true,
                message: 'API Key created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create API Key');
        }
    }

    async findAll() {
        try {

            const data = await this.apikeyRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'API Key fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch API Key');
        }
    }

    async findOne(id: number) {
        try {
            const apikey = await this.apikeyRepository.findOne({
                where: { id },
            });

            if (!apikey) {
                throw new NotFoundException('API Key not found');
            }

            return {
                success: true,
                message: 'API Key fetched successfully',
                data: apikey,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<ElearningApiKey>) {
        try {
            const apikey = await this.apikeyRepository.findOne({
                where: { id },
            });

            if (!apikey) {
                throw new NotFoundException('API Key not found');
            }

            Object.assign(apikey, data);

            const updated = await this.apikeyRepository.save(apikey);

            return {
                success: true,
                message: 'API Key updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const apikey = await this.apikeyRepository.findOne({
                where: { id },
            });

            if (!apikey) {
                throw new NotFoundException('API Key not found');
            }

            await this.apikeyRepository.remove(apikey);

            return {
                success: true,
                message: 'API Key deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}