import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ContentOverviewController } from './contentoverview.controller';
import { ContentOverviewService } from './contentoverview.service';
import { ContentOverview } from './entities/contentoverview.entity';
import { GlobalImpotance } from './entities/global.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ContentOverview, GlobalImpotance, Category])],
    controllers: [ContentOverviewController],
    providers: [ContentOverviewService],
})
export class ContentOverviewModule { }