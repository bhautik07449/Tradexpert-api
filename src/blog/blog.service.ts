import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogCategory } from 'src/blogCategory/entities/blogcategory.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,

        @InjectRepository(BlogCategory)
        private readonly blogCategoryRepository: Repository<BlogCategory>,
    ) { }

    async create(data: Partial<Blog>) {
        if (data.blog_category?.id) {
            const category = await this.blogCategoryRepository.findOne({
                where: { id: data.blog_category.id },
            });

            if (!category) throw new NotFoundException('Blog category not found');

            data.blog_category = category;
        }

        const blog = this.blogRepository.create(data);
        const saved = await this.blogRepository.save(blog);

        return {
            success: true,
            message: 'Blog created successfully',
            data: saved,
        };
    }

    async findAll() {
        const blogs = await this.blogRepository.find({
            relations: ['blog_category'],
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            data: blogs,
        };
    }

    async findOne(id: number) {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['blog_category'],
        });

        if (!blog) throw new NotFoundException('Blog not found');

        return {
            success: true,
            data: blog,
        };
    }

    async update(id: number, data: Partial<Blog>) {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['blog_category'],
        });

        if (!blog) throw new NotFoundException('Blog not found');

        if (data.blog_category?.id) {
            const category = await this.blogCategoryRepository.findOne({
                where: { id: data.blog_category.id },
            });

            if (!category) throw new NotFoundException('Blog category not found');

            blog.blog_category = category;
        }

        Object.assign(blog, data);

        const updated = await this.blogRepository.save(blog);

        return {
            success: true,
            message: 'Blog updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const blog = await this.blogRepository.findOne({ where: { id } });

        if (!blog) throw new NotFoundException('Blog not found');

        await this.blogRepository.remove(blog);

        return {
            success: true,
            message: 'Blog deleted successfully',
        };
    }
}