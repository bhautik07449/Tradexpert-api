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
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: Partial<Category>, @Request() req: any): Promise<Category> {
        return this.categoriesService.create(body, req?.user);
    }

    @Get()
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Get('country')
    findAllByCountry(@Query('country') country: string): Promise<Category[]> {
        return this.categoriesService.findAllByCountry(country);
    }

    @Get('hierarchy')
    getHierarchy(@Query('country') country?: string): Promise<any[]> {
        return this.categoriesService.getHierarchy(country);
    }

    @Get('flat')
    findFlat() {
        return this.categoriesService.findFlat();
    }

    @Get('parents')
    findParents() {
        return this.categoriesService.findParents();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoriesService.findOne(id);
    }

    @Patch('hierarchy/update')
    @UseGuards(AdminOrSupplierAuthGuard)
    updateHierarchy(
        @Body() body: { categoryId?: number; subcategoryId?: number; productId?: number },
    ): Promise<{ message: string }> {
        return this.categoriesService.updateHierarchy(body.categoryId, body.subcategoryId, body.productId);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Category>,
        @Request() req: any,
    ): Promise<Category> {
        return this.categoriesService.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.categoriesService.remove(id);
    }
}