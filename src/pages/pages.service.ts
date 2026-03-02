import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Page, PageStatus } from './entities/pages.entity';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Page)
        private readonly pageRepo: Repository<Page>,
    ) { }

    async create(data: Partial<Page>) {
        try {
            const page = this.pageRepo.create(data);
            const saved = await this.pageRepo.save(page);

            return {
                success: true,
                message: 'Page created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create page');
        }
    }

    async findAll() {
        const pages = await this.pageRepo.find({
            where: { status: Not(PageStatus.INACTIVE) },
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Pages fetched successfully',
            data: pages,
        };
    }

    async findOne(id: number) {
        const page = await this.pageRepo.findOne({
            where: { id },
        });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        return {
            success: true,
            message: 'Page fetched successfully',
            data: page,
        };
    }

    async update(id: number, data: Partial<Page>) {
        const page = await this.pageRepo.findOne({ where: { id } });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        Object.assign(page, data);
        const updated = await this.pageRepo.save(page);

        return {
            success: true,
            message: 'Page updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const page = await this.pageRepo.findOne({ where: { id } });

        if (!page) {
            throw new NotFoundException('Page not found');
        }

        await this.pageRepo.remove(page);

        return {
            success: true,
            message: 'Page deleted successfully',
        };
    }
}