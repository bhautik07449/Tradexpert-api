import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopPrepositionsService } from './develop-prepositions.service';
import { DevelopPrepositionsController } from './develop-prepositions.controller';
import { DevelopPreposition } from './entities/develop-preposition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevelopPreposition])],
  controllers: [DevelopPrepositionsController],
  providers: [DevelopPrepositionsService],
  exports: [DevelopPrepositionsService]
})
export class DevelopPrepositionsModule {}