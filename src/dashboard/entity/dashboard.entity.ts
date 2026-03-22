import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Inquiry } from 'src/inquiry/entities/inquiry.entity';
import { Product } from 'src/product/entities/product.entity';
import { Quotation } from 'src/quotation/entities/quotation.entity';
import { Requestsamples } from 'src/requestsamples/entities/requestsamples.entity';
import { DashboardController } from '../dashboard.controller';
import { DashboardService } from '../dashboard.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            Category,
            Quotation,
            Requestsamples,
            Inquiry,
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }