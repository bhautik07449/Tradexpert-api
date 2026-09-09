import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { RequestInfo, Status } from "./entities/requestInfo.entity";

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
            const whereClause: any = country ? { country: country } : {};
            whereClause.status = Not(Status.DELETED);

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
                where: { id, status: Not(Status.DELETED) },
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
                where: { id, status: Not(Status.DELETED) },
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
                where: { id, status: Not(Status.DELETED) },
            });

            if (!requestInfo) {
                throw new NotFoundException('Request Info not found');
            }

            requestInfo.status = Status.DELETED;
            await this.requestInfoRepository.save(requestInfo);

            return {
                success: true,
                message: 'Request Info deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}