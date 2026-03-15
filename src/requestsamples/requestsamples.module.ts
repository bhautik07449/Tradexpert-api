import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsamplesController } from './requestsamples.controller';
import { Requestsamples } from './entities/requestsamples.entity';
import { RequestsamplesService } from './requestsamples.service';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyers/entities/buyer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Requestsamples, Product, Buyer])],
    providers: [RequestsamplesService],
    controllers: [RequestsamplesController],
})
export class RequestsamplesModule { }