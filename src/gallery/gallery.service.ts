import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Gallery } from "./entities/gallery.entity";

@Injectable()
export class GalleryService {
    constructor(
        @InjectRepository(Gallery)
        private readonly galleryRepository: Repository<Gallery>
    ) { }

    async create(data: Partial<Gallery>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const gallery = this.galleryRepository.create(data);
            const saved = await this.galleryRepository.save(gallery);

            return {
                success: true,
                message: 'gallery created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create gallery');
        }
    }

    async findAll() {
        try {
            const data = await this.galleryRepository.find({
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'gallery fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch gallery');
        }
    }

    async findOne(id: number) {
        try {
            const gallery = await this.galleryRepository.findOne({
                where: { id },
            });

            if (!gallery) {
                throw new NotFoundException('gallery not found');
            }

            return {
                success: true,
                message: 'gallery fetched successfully',
                data: gallery,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Gallery>) {
        try {
            const gallery = await this.galleryRepository.findOne({
                where: { id },
            });

            if (!gallery) {
                throw new NotFoundException('gallery not found');
            }

            Object.assign(gallery, data);

            const updated = await this.galleryRepository.save(gallery);

            return {
                success: true,
                message: 'gallery updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const gallery = await this.galleryRepository.findOne({
                where: { id },
            });

            if (!gallery) {
                throw new NotFoundException('gallery not found');
            }

            await this.galleryRepository.remove(gallery);

            return {
                success: true,
                message: 'gallery deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}