import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialSettings } from './entities/socialsetting.entity';

@Injectable()
export class SocialSettingsService {

  constructor(
    @InjectRepository(SocialSettings)
    private repo: Repository<SocialSettings>,
  ) {}

  async getSettings() {
    const settings = await this.repo.findOne({ where: { id: 1 } });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  async updateSettings(data: Partial<SocialSettings>) {
    // const settings = await this.repo.findOne({ where: { id: 1 } });

    // if (!settings) {
    //   throw new NotFoundException('Settings not found');
    // }

    // Object.assign(settings, data);

    return this.repo.save(data);
  }
}