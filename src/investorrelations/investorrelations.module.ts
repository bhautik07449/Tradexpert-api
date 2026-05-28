import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorrelationsService } from './investorrelations.service';
import { InvestorrelationsController } from './investorrelations.controller';
import { Investorrelations } from './entities/investorrelations.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Investorrelations, Product])],
    providers: [InvestorrelationsService],
    controllers: [InvestorrelationsController],
    exports: [InvestorrelationsService],
})
export class InvestorrelationsModule { }