import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Category, Product]), AuthModule],
    providers: [BrandsService],
    controllers: [BrandsController],
})
export class BrandsModule { }