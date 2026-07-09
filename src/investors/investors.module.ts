import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor } from './entities/investor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investor])],
  controllers: [InvestorsController],
  providers: [InvestorsService],
  exports: [InvestorsService],
})
export class InvestorsModule {}
