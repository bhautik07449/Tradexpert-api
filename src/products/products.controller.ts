import { Controller, Post, Body, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    createProduct(@Body() dto: CreateProductDto) {
        return this.productsService.createProduct(dto);
    }

    @Get()
    getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    findOneById(@Param('id') id: number) {
        return this.productsService.findOneById(id);
    }
}
