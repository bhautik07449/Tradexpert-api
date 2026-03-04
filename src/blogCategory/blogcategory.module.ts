import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blogcategory.entity';
import { BlogCategoryService } from './blogcategory.service';
import { BlogCategoryController } from './blogcategory.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategory])],
    providers: [BlogCategoryService],
    controllers: [BlogCategoryController],
})
export class BlogCategoryModule { }