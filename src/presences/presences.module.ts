import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresencesService } from './presences.service';
import { PresencesController } from './presences.controller';
import { Presences } from './entities/presences.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Presences, Category])],
    providers: [PresencesService],
    controllers: [PresencesController],
})
export class PresencesModule { }