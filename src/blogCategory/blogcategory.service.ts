import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogCategory } from "./entities/blogcategory.entity";
import { Repository } from "typeorm";

@Injectable()
export class BlogCategoryService {
    constructor(
        @InjectRepository(BlogCategory)
        private readonly blogcategoryRepository: Repository<BlogCategory>
    ) { }

    async create(data: Partial<BlogCategory>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const blog = this.blogcategoryRepository.create(data);
            const saved = await this.blogcategoryRepository.save(blog);

            return {
                success: true,
                message: 'Blog category created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create currency');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.blogcategoryRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Blog category fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Blog category');
        }
    }

    async findOne(id: number) {
        try {
            const blogcategory = await this.blogcategoryRepository.findOne({
                where: { id },
            });

            if (!blogcategory) {
                throw new NotFoundException('Blog category not found');
            }

            return {
                success: true,
                message: 'Blog category fetched successfully',
                data: blogcategory,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<BlogCategory>) {
        try {
            const blogcategory = await this.blogcategoryRepository.findOne({
                where: { id },
            });

            if (!blogcategory) {
                throw new NotFoundException('Blog category not found');
            }

            Object.assign(blogcategory, data);

            const updated = await this.blogcategoryRepository.save(blogcategory);

            return {
                success: true,
                message: 'Blog category updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const blogcategory = await this.blogcategoryRepository.findOne({
                where: { id },
            });

            if (!blogcategory) {
                throw new NotFoundException('Blog category not found');
            }

            await this.blogcategoryRepository.remove(blogcategory);

            return {
                success: true,
                message: 'Blog category deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}