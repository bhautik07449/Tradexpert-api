import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    Patch,
    Query,
    Request,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: Partial<Brand>, @Request() req: any): Promise<Brand> {
        return this.brandsService.create(body, req?.user);
    }

    @Get()
    findAll(@Query('country') country: string, @Request() req: any): Promise<Brand[]> {
        return this.brandsService.findAll(country, req?.user);
    }

    @Get('grouped')
    groupByCategoryAndCountry(@Query('country') country: string) {
        return this.brandsService.groupByCategoryAndCountry(country);
    }

    @Get(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Brand> {
        return this.brandsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Brand>,
        @Request() req: any,
    ): Promise<Brand> {
        return this.brandsService.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.brandsService.remove(id);
    }
}