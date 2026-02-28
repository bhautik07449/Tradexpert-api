import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    create(@Body() body: Partial<Brand>): Promise<Brand> {
        return this.brandsService.create(body);
    }

    @Get()
    findAll(): Promise<Brand[]> {
        return this.brandsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Brand> {
        return this.brandsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Brand>,
    ): Promise<Brand> {
        return this.brandsService.update(id, body);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.brandsService.remove(id);
    }
}