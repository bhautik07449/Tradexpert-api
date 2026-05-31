import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Category, Product])],
    providers: [BrandsService],
    controllers: [BrandsController],
})
export class BrandsModule { }