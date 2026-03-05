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

            if (!data.sr_no) {
                throw new BadRequestException('sr_no is required');
            }

            const existing = await this.galleryRepository.findOne({
                where: { sr_no: data.sr_no }
            });

            if (existing) {
                throw new BadRequestException(`Position ${data.sr_no} already exists`);
            }

            const gallery = this.galleryRepository.create(data);
            const saved = await this.galleryRepository.save(gallery);

            return {
                success: true,
                message: 'gallery created successfully',
                data: saved,
            };

        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const data = await this.galleryRepository.find({
                order: { sr_no: 'ASC' },
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

        const gallery = await this.galleryRepository.findOne({
            where: { id },
        });

        if (!gallery) {
            throw new NotFoundException('gallery not found');
        }

        if (data.sr_no) {
            const existing = await this.galleryRepository.findOne({
                where: { sr_no: data.sr_no }
            });

            if (existing && existing.id !== id) {
                throw new BadRequestException(`Position ${data.sr_no} already exists`);
            }
        }

        Object.assign(gallery, data);

        const updated = await this.galleryRepository.save(gallery);

        return {
            success: true,
            message: 'gallery updated successfully',
            data: updated,
        };
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