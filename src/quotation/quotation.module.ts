import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './entities/quotation.entity';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Quotation])],
    providers: [QuotationService],
    controllers: [QuotationController],
})
export class QuotationModule { }