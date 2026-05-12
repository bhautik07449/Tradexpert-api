import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homebanner } from './entities/homebanner.entity';
import { HomebannerService } from './homebanner.service';
import { HomebannerController } from './homebanner.controller';
import { Category } from 'src/categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Homebanner, Category])],
    providers: [HomebannerService],
    controllers: [HomebannerController],
})
export class HomebannerModule { }