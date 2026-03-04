import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRequest } from './entities/offerrequest.entity';
import { Tradeoffer } from 'src/tradeoffer/entities/tradeoffer.entity';
import { OfferRequestController } from './offerrequest.controller';
import { OfferRequestService } from './offerrequest.service';

@Module({
    imports: [TypeOrmModule.forFeature([OfferRequest, Tradeoffer])],
    controllers: [OfferRequestController],
    providers: [OfferRequestService],
})
export class OfferRequestModule { }