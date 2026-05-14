import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Countryproduct } from './entities/countryproduct.entity';
import { Countryproductname } from 'src/countryproductname/entities/countryproductname.entity';
import { CountryproductController } from './countryproduct.controller';
import { CountryproductService } from './countryproduct.service';

@Module({
    imports: [TypeOrmModule.forFeature([Countryproduct, Countryproductname, Category, Product])],
    controllers: [CountryproductController],
    providers: [CountryproductService],
})
export class CountryproductModule { }