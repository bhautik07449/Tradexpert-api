import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Blog>) {
        return this.blogService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.blogService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.blogService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Blog>,
    ) {
        return this.blogService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.blogService.remove(id);
    }
}