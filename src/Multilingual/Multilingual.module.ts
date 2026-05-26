import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Multilingual } from './entities/Multilingual.entity';
import { MultilingualService } from './Multilingual.service';
import { MultilingualController } from './Multilingual.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Multilingual])],
    providers: [MultilingualService],
    controllers: [MultilingualController],
    exports: [MultilingualService],
})
export class MultilingualModule { }