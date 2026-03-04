import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tradetype } from './entities/tradetype.entity';
import { TradetypeService } from './tradetype.service';
import { TradetypeController } from './tradetype.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tradetype])],
    providers: [TradetypeService],
    controllers: [TradetypeController],
})
export class TradetypeModule { }