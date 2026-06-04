import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorrelationsService } from './investorrelations.service';
import { InvestorrelationsController } from './investorrelations.controller';
import { Investorrelations } from './entities/investorrelations.entity';
import { Product } from 'src/product/entities/product.entity';
import { Financial } from 'src/financialservice/entities/financialservice.entity';
import { IRProject } from 'src/IRProject/entities/IRProject.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Investorrelations, Product, Financial, IRProject])],
    providers: [InvestorrelationsService],
    controllers: [InvestorrelationsController],
    exports: [InvestorrelationsService],
})
export class InvestorrelationsModule { }