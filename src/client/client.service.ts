import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Client, status } from "./entities/client.entity";

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>
    ) { }

    async create(data: Partial<Client>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const team = this.clientRepository.create(data);
            const saved = await this.clientRepository.save(team);

            return {
                success: true,
                message: 'Client created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Client');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = country ? { country: country, status: Not(status.DELETED) } : { status: Not(status.DELETED) };

            const data = await this.clientRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Client fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Client');
        }
    }

    async findOne(id: number) {
        try {
            const Client = await this.clientRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!Client) {
                throw new NotFoundException('Client not found');
            }

            return {
                success: true,
                message: 'Client fetched successfully',
                data: Client,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Client>) {
        try {
            const Client = await this.clientRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!Client) {
                throw new NotFoundException('Client not found');
            }

            Object.assign(Client, data);

            const updated = await this.clientRepository.save(Client);

            return {
                success: true,
                message: 'Client updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const client = await this.clientRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!client) {
                throw new NotFoundException('Client not found');
            }

            client.status = status.DELETED;
            await this.clientRepository.save(client);

            return {
                success: true,
                message: 'Client deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}