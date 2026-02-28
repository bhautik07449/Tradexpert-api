import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { BuyersModule } from 'src/buyers/buyers.module';
import { Inquiry } from './entities/inquiry.entity';
import { RequestSample } from './entities/request-sample.entity';
import { Quotation } from './entities/quotation.entity';
import { CreditAccount } from './entities/credit-account.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Inquiry, RequestSample, Quotation, CreditAccount]),
        BuyersModule,
    ],
})
export class BuyerInteractionsModule { }
