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

import { ProductService } from './product.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: any) {
        return this.productService.create(body);
    }

    @Get()
    findAll(
        @Query('country') country?: string,
        @Query('season') season?: string,
        @Query('category') category?: string,
        @Query('subcategory') subcategory?: string
    ) {
        return this.productService.findAll(season, category, country, subcategory);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

    @Get('/category/:slug')
    findByslug(@Param('slug') slug: string) {
        return this.productService.findBycat(slug);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(@Param('id') id: number, @Body() body: any) {
        return this.productService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}