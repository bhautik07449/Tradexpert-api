import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BlogCategoryService } from "./blogcategory.service";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { BlogCategory } from "./entities/blogcategory.entity";

@Controller('blogcategory')
export class BlogCategoryController {
    constructor(private readonly blogcategoryService: BlogCategoryService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<BlogCategory>) {
        return this.blogcategoryService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.blogcategoryService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.blogcategoryService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<BlogCategory>,
    ) {
        return this.blogcategoryService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.blogcategoryService.remove(id);
    }

}