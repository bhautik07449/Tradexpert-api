import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tradetype } from './entities/tradetype.entity';
import { TradetypeService } from './tradetype.service';
import { TradetypeController } from './tradetype.controller';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tradetype, Tradeoffer])],
    providers: [TradetypeService],
    controllers: [TradetypeController],
})
export class TradetypeModule { }