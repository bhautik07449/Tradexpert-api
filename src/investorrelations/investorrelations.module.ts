import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorrelationsService } from './investorrelations.service';
import { InvestorrelationsController } from './investorrelations.controller';
import { Investorrelations } from './entities/investorrelations.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Investorrelations])],
    providers: [InvestorrelationsService],
    controllers: [InvestorrelationsController],
    exports: [InvestorrelationsService],
})
export class InvestorrelationsModule { }