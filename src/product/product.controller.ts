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
    @UseGuards(AdminOrSupplierAuthGuard)
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

    @Patch(':id/approve')
    @UseGuards(AdminOrSupplierAuthGuard)
    approve(@Param('id') id: string) {
        return this.productService.update(Number(id), { approval_status: 'approved' });
    }

    @Patch(':id/reject')
    @UseGuards(AdminOrSupplierAuthGuard)
    reject(@Param('id') id: string, @Body() body: any) {
        return this.productService.update(Number(id), { approval_status: 'rejected', rejection_reason: body?.reason });
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}