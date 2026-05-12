import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytical } from './entities/analytical.entity';
import { AnalyticalService } from './analytical.service';
import { AnalyticalController } from './analytical.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Analytical])],
    providers: [AnalyticalService],
    controllers: [AnalyticalController],
})
export class AnalyticalModule { }