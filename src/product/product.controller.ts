import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
} from '@nestjs/common';

import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() body: any) {
        return this.productService.create(body);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.productService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}