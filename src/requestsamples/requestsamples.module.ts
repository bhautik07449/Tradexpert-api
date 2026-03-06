import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsamplesController } from './requestsamples.controller';
import { Requestsamples } from './entities/requestsamples.entity';
import { RequestsamplesService } from './requestsamples.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Requestsamples, Product])],
    providers: [RequestsamplesService],
    controllers: [RequestsamplesController],
})
export class RequestsamplesModule { }