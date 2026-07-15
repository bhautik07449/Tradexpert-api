import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestInfo } from './entities/requestInfo.entity';
import { RequestInfoService } from './requestInfo.service';
import { RequestInfoController } from './requestInfo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RequestInfo])],
    providers: [RequestInfoService],
    controllers: [RequestInfoController],
    exports: [RequestInfoService],
})
export class RequestInfoModule { }