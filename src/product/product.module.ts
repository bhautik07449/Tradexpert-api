import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';
import { Financial } from 'src/financialservice/entities/financialservice.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Measurement, Tradeoffer, Financial])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule { }