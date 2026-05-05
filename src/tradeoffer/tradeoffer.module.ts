import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tradeoffer } from './entities/tradeoffer.entity';
import { TradeofferItem } from './entities/tradeoffer-item.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { TradeofferService } from './tradeoffer.service';
import { TradeofferController } from './tradeoffer.controller';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tradeoffer, TradeofferItem, Tradetype, Category, Product])],
    controllers: [TradeofferController],
    providers: [TradeofferService],
})
export class TradeofferModule { }