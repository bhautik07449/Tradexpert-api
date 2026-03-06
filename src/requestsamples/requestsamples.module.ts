import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsamplesController } from './requestsamples.controller';
import { Requestsamples } from './entities/requestsamples.entity';
import { RequestsamplesService } from './requestsamples.service';

@Module({
    imports: [TypeOrmModule.forFeature([Requestsamples])],
    providers: [RequestsamplesService],
    controllers: [RequestsamplesController],
})
export class RequestsamplesModule { }