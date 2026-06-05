import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpcomingCollaboration } from './entities/UpcomingCollaboration.entity';
import { UpcomingCollaborationController } from './UpcomingCollaboration.controller';
import { UpcomingCollaborationService } from './UpcomingCollaboration.service';

@Module({
    imports: [TypeOrmModule.forFeature([UpcomingCollaboration])],
    controllers: [UpcomingCollaborationController],
    providers: [UpcomingCollaborationService],
})
export class upcomingcollaborationserviceModule { }