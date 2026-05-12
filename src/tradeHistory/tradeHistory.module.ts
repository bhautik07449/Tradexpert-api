import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeHistory } from './entities/tradeHistory.entity';
import { TradeHistoryService } from './tradeHistory.service';
import { TradeHistoryController } from './tradeHistory.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TradeHistory])],
    providers: [TradeHistoryService],
    controllers: [TradeHistoryController],
})
export class TradeHistoryModule { }