import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeLawService } from './tradeLaw.service';
import { TradeLawController } from './tradeLaw.controller';
import { TradeLawEntity } from './entities/tradeLaw.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TradeLawEntity])],
    controllers: [TradeLawController],
    providers: [TradeLawService],
    exports: [TradeLawService],
})
export class TradeLawModule {}