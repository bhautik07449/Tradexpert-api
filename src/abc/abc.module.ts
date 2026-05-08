import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { AbcController } from './abc.controller';
import { AbcService } from './abc.service';
import { Abc } from './entities/abc.entity';
import { Abctype } from 'src/abcType/entities/abctype.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Abc, Category, Product, Abctype])],
    controllers: [AbcController],
    providers: [AbcService],
})
export class AbcModule { }