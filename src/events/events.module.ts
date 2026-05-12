import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from './entities/events.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Events])],
    providers: [EventsService],
    controllers: [EventsController],
})
export class EventsModule { }