import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    Query,
    Request,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: any, @Request() req: any) {
        return this.productService.create(body, req?.user);
    }

    @Get()
    findAll(
        @Query('country') country?: string,
        @Query('season') season?: string,
        @Query('category') category?: string,
        @Query('subcategory') subcategory?: string,
        @Request() req?: any
    ) {
        return this.productService.findAll(season, category, country, subcategory, req?.user);
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
    @UseGuards(AdminOrSupplierAuthGuard)
    update(@Param('id') id: number, @Body() body: any, @Request() req: any) {
        return this.productService.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}