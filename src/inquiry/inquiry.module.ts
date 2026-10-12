import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyers/entities/buyer.entity';
import { InterwatchAlertModule } from 'src/interwatch-alert/interwatch-alert.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Inquiry, Product, Buyer]), InterwatchAlertModule, AuthModule],
    providers: [InquiryService],
    controllers: [InquiryController],
})
export class InquiryModule { }