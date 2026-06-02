import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ESG } from './entities/ESG.entity';
import { ESGService } from './ESG.service';
import { ESGController } from './ESG.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ESG, Category])],
    providers: [ESGService],
    controllers: [ESGController],
    exports: [ESGService],
})
export class ESGModule { }