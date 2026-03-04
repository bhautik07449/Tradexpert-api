import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Qualitypolicy } from './entities/qualitypolicy.entity';
import { QualitypolicyService } from './qualitypolicy.service';
import { QualityPolicyController } from './qualitypolicy.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Qualitypolicy, Category])],
    providers: [QualitypolicyService],
    controllers: [QualityPolicyController],
})
export class QualityPolicyModule { }