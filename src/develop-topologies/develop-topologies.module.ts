import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopTopologiesService } from './develop-topologies.service';
import { DevelopTopologiesController } from './develop-topologies.controller';
import { DevelopTopology } from './entities/develop-topology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevelopTopology])],
  controllers: [DevelopTopologiesController],
  providers: [DevelopTopologiesService],
  exports: [DevelopTopologiesService]
})
export class DevelopTopologiesModule {}