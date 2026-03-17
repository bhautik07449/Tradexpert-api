import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { Page } from './entities/pages.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Page>) {
        return this.pagesService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.pagesService.findAll();
    }

    @Get('slug/:page_url')
    findurl(@Param('page_url') page_url: string) {
        return this.pagesService.findSlug(page_url);
    }


    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pagesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Page>,
    ) {
        return this.pagesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pagesService.remove(id);
    }
}