import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RequestInfo } from "./entities/requestInfo.entity";

@Injectable()
export class RequestInfoService {
    constructor(
        @InjectRepository(RequestInfo)
        private readonly requestInfoRepository: Repository<RequestInfo>
    ) { }

    async create(data: Partial<RequestInfo>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const requestInfo = this.requestInfoRepository.create(data);
            const saved = await this.requestInfoRepository.save(requestInfo);

            return {
                success: true,
                message: 'Request Info created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Request Info');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.requestInfoRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Request Info fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Request Info');
        }
    }

    async findOne(id: number) {
        try {
            const requestInfo = await this.requestInfoRepository.findOne({
                where: { id },
            });

            if (!requestInfo) {
                throw new NotFoundException('Request Info not found');
            }

            return {
                success: true,
                message: 'Request Info fetched successfully',
                data: requestInfo,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<RequestInfo>) {
        try {
            const requestInfo = await this.requestInfoRepository.findOne({
                where: { id },
            });

            if (!requestInfo) {
                throw new NotFoundException('Request Info not found');
            }

            Object.assign(requestInfo, data);

            const updated = await this.requestInfoRepository.save(requestInfo);

            return {
                success: true,
                message: 'Request Info updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const requestInfo = await this.requestInfoRepository.findOne({
                where: { id },
            });

            if (!requestInfo) {
                throw new NotFoundException('Request Info not found');
            }

            await this.requestInfoRepository.remove(requestInfo);

            return {
                success: true,
                message: 'Request Info deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}