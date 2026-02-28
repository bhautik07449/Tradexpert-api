import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Measurement]),
    ],
})
export class MeasurementsModule { }
