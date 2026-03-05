import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralSettings } from './entities/generalsetting.entity';
import { GeneralSettingsService } from './generalsetting.service';
import { GeneralSettingsController } from './generalsetting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralSettings])],
  controllers: [GeneralSettingsController],
  providers: [GeneralSettingsService],
})
export class GeneralSettingsModule {}