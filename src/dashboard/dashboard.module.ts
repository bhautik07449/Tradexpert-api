import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Inquiry } from 'src/inquiry/entities/inquiry.entity';
import { Product } from 'src/product/entities/product.entity';
import { Quotation } from 'src/quotation/entities/quotation.entity';
import { Requestsamples } from 'src/requestsamples/entities/requestsamples.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { Team } from 'src/team/entities/team.entity';
import { Client } from 'src/client/entities/client.entity';
import { Events } from 'src/events/entities/events.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Brand } from 'src/brands/entities/brand.entity';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            Product,
            Category,
            Quotation,
            Requestsamples,
            Inquiry,
            Blog,
            Team,
            Client,
            Events,
            Brand,
            Tradeoffer,
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }