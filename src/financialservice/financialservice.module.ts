import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Financial } from './entities/financialservice.entity';
import { FinancialService } from './financialservice.service';
import { FinacialController } from './financialservice.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Financial])],
    providers: [FinancialService],
    controllers: [FinacialController],
    exports: [FinancialService],
})
export class FinancialModule { }