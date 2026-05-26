import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryReach } from './entities/deliveryreach.entity';
import { DeliveryReachService } from './deliveryreach.service';
import { DeliveryreachController } from './deliveryreach.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DeliveryReach])],
    providers: [DeliveryReachService],
    controllers: [DeliveryreachController],
    exports: [DeliveryReachService],
})
export class DeliveryReachModule { }