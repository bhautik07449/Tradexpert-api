import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Events, status } from "./entities/events.entity";

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Events)
        private readonly eventsRepository: Repository<Events>
    ) { }

    async create(data: Partial<Events>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const event = this.eventsRepository.create(data);
            const saved = await this.eventsRepository.save(event);

            return {
                success: true,
                message: 'Event created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Event');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = country ? { country: country, status: Not(status.DELETED) } : { status: Not(status.DELETED) };

            const data = await this.eventsRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Events fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Events');
        }
    }

    async findOne(id: number) {
        try {
            const event = await this.eventsRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!event) {
                throw new NotFoundException('Event not found');
            }

            return {
                success: true,
                message: 'Event fetched successfully',
                data: event,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Events>) {
        try {
            const event = await this.eventsRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!event) {
                throw new NotFoundException('Event not found');
            }

            Object.assign(event, data);

            const updated = await this.eventsRepository.save(event);

            return {
                success: true,
                message: 'Event updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const event = await this.eventsRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!event) {
                throw new NotFoundException('Event not found');
            }

            event.status = status.DELETED;
            await this.eventsRepository.save(event);

            return {
                success: true,
                message: 'Event deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}