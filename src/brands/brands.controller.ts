import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Brand>): Promise<Brand> {
        return this.brandsService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(): Promise<Brand[]> {
        return this.brandsService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Brand> {
        return this.brandsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Brand>,
    ): Promise<Brand> {
        return this.brandsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.brandsService.remove(id);
    }
}