import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homebanner } from './entities/homebanner.entity';
import { HomebannerService } from './homebanner.service';
import { HomebannerController } from './homebanner.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Homebanner])],
    providers: [HomebannerService],
    controllers: [HomebannerController],
})
export class HomebannerModule { }