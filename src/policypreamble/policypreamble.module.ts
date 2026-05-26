import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyPreamble } from './entities/policypreamble.entity';
import { PolicyPreambleService } from './policypreamble.service';
import { PolicyPreambleController } from './policypreamble.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PolicyPreamble])],
    providers: [PolicyPreambleService],
    controllers: [PolicyPreambleController],
    exports: [PolicyPreambleService],
})
export class PolicyPreambleModule { }