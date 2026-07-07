import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeControllerService } from './tradeController.service';
import { TradeController } from './tradeController.controller';
import { TradeControllerEntity } from './entities/tradeController.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TradeControllerEntity, Category])],
    controllers: [TradeController],
    providers: [TradeControllerService],
    exports: [TradeControllerService],
})
export class TradeControllerModule {}
