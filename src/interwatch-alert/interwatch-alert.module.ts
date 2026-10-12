import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterwatchAlert } from './entities/interwatch-alert.entity';
import { InterwatchAlertService } from './interwatch-alert.service';
import { InterwatchAlertController } from './interwatch-alert.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([InterwatchAlert]),
        AuthModule,
    ],
    controllers: [InterwatchAlertController],
    providers: [InterwatchAlertService],
    exports: [InterwatchAlertService],
})
export class InterwatchAlertModule { }
