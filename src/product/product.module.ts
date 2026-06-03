import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Measurement, Tradetype])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule { }