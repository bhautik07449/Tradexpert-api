import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tradeoffer } from './entities/tradeoffer.entity';
import { Tradetype } from 'src/tradetype/entities/tradetype.entity';
import { TradeofferService } from './tradeoffer.service';
import { TradeofferController } from './tradeoffer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tradeoffer, Tradetype])],
    controllers: [TradeofferController],
    providers: [TradeofferService],
})
export class TradeofferModule { }