import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialSettings } from './entities/socialsetting.entity';
import { SocialSettingsController } from './socialsetting.controller';
import { SocialSettingsService } from './socialsetting.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocialSettings])],
  controllers: [SocialSettingsController],
  providers: [SocialSettingsService],
})
export class SocialSettingsModule {}