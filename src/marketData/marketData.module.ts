import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketData } from './entities/marketData.entity';
import { MarketDataService } from './marketData.service';
import { MarketDataController } from './marketData.controller';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MarketData, Category, Product])],
    providers: [MarketDataService],
    controllers: [MarketDataController],
    exports: [MarketDataService],
})
export class MarketDataModule { }