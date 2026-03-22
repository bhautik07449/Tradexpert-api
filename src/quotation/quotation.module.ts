import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './entities/quotation.entity';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { Category } from 'src/categories/entities/category.entity';
import { Measurement } from 'src/measurements/entities/measurement.entity';
import { Currency } from 'src/currency/entities/currency.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quotation, Category, Measurement, Currency])],
    providers: [QuotationService],
    controllers: [QuotationController],
})
export class QuotationModule { }