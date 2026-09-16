import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMR } from './entities/dmr.entity';
import { MarketDetails } from './entities/dmr-market.entity';
import { DMRController } from './dmr.controller';
import { DRMService } from './dmr.service';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([DMR, MarketDetails, Category, Product]), AuthModule],
    controllers: [DMRController],
    providers: [DRMService],
})
export class DRMModule { }