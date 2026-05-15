import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ContentOverviewService } from './contentoverview.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('contentoverview')
export class ContentOverviewController {
    constructor(private readonly contentoverviewService: ContentOverviewService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: any) {
        return this.contentoverviewService.create(body);
    }

    @Get()
    findAll() {
        return this.contentoverviewService.findAll();
    }

    @Get('category')
    findByCategory(@Query('category') category: any) {
        return this.contentoverviewService.findByCategory(category);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.contentoverviewService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(@Param('id') id: number, @Body() body: any) {
        return this.contentoverviewService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    delete(@Param('id') id: number) {
        return this.contentoverviewService.delete(id);
    }
}