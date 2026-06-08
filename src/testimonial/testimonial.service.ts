import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Testimonial } from './entities/testimonial.entity';

@Injectable()
export class TestimonialService {
    constructor(
        @InjectRepository(Testimonial)
        private readonly testimonialManagementRepo: Repository<Testimonial>,

        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
    ) { }

    async create(data: Partial<Testimonial>) {
        if (data.client?.id) {
            const client = await this.clientRepo.findOne({
                where: { id: data.client.id },
            });

            if (!client) throw new NotFoundException('Client not found');

            data.client = client;
        }

        const testimonial = this.testimonialManagementRepo.create(data);
        const saved = await this.testimonialManagementRepo.save(testimonial);

        return {
            success: true,
            message: 'Testimonial created successfully',
            data: saved,
        };
    }

    async findAll(country?: string) {
        const whereClause = country ? { client: { country: country } } : {}

        const data = await this.testimonialManagementRepo.find({
            relations: ['client'],
            order: { createdAt: 'DESC' },
            where: whereClause
        });

        return {
            success: true,
            message: 'Testimonials fetched successfully',
            data,
        };
    }

    async findOne(id: number) {
        const data = await this.testimonialManagementRepo.findOne({
            where: { id },
            relations: ['client'],
        });

        if (!data) throw new NotFoundException('Testimonial not found');

        return {
            success: true,
            message: 'Testimonial fetched successfully',
            data,
        };
    }

    async update(id: number, body: Partial<Testimonial>) {
        const testimonial = await this.testimonialManagementRepo.findOne({
            where: { id },
            relations: ['client'],
        });

        if (!testimonial) throw new NotFoundException('Testimonial not found');

        if (body.client?.id) {
            const client = await this.clientRepo.findOne({
                where: { id: body.client.id },
            });

            if (!client) throw new NotFoundException('Client not found');

            testimonial.client = client;
        }

        Object.assign(testimonial, body);

        const updated = await this.testimonialManagementRepo.save(testimonial);

        return {
            success: true,
            message: 'Testimonial updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const testimonial = await this.testimonialManagementRepo.findOne({
            where: { id },
        });

        if (!testimonial) throw new NotFoundException('Testimonial not found');

        await this.testimonialManagementRepo.remove(testimonial);

        return {
            success: true,
            message: 'Testimonial deleted successfully',
        };
    }
}