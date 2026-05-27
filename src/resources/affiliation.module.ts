import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliation } from './entities/affiliation.entity';
import { AffiliationService } from './affiliation.service';
import { AffiliationController } from './affiliation.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Affiliation])],
    providers: [AffiliationService],
    controllers: [AffiliationController],
    exports: [AffiliationService],
})
export class AffiliationModule { }