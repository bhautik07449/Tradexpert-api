import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresencesService } from './presences.service';
import { PresencesController } from './presences.controller';
import { Presences } from './entities/presences.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Presences])],
    providers: [PresencesService],
    controllers: [PresencesController],
})
export class PresencesModule { }