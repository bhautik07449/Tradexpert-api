import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDevelopment } from './entities/marketDevelopment.entity';
import { marketDevelopmentService } from './marketDevelopment.service';
import { MarketDevelopmentController } from './marketDevelopment.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MarketDevelopment])],
    providers: [marketDevelopmentService],
    controllers: [MarketDevelopmentController],
    exports: [marketDevelopmentService],
})
export class MarketDevelopmentModule { }