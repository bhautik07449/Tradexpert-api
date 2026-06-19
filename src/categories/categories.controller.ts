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
    UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Category>): Promise<Category> {
        return this.categoriesService.create(body);
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
    @UseGuards(AdminAuthGuard)
    updateHierarchy(
        @Body() body: { categoryId?: number; subcategoryId?: number; productId?: number },
    ): Promise<{ message: string }> {
        return this.categoriesService.updateHierarchy(body.categoryId, body.subcategoryId, body.productId);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Category>,
    ): Promise<Category> {
        return this.categoriesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.categoriesService.remove(id);
    }
}