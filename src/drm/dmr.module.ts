import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMR } from './entities/dmr.entity';
import { MarketDetails } from './entities/dmr-market.entity';
import { DMRController } from './dmr.controller';
import { DRMService } from './dmr.service';
import { Category } from 'src/categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DMR, MarketDetails, Category])],
    controllers: [DMRController],
    providers: [DRMService],
})
export class DRMModule { }