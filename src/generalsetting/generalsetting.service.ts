import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralSettings } from './entities/generalsetting.entity';

@Injectable()
export class GeneralSettingsService {

  constructor(
    @InjectRepository(GeneralSettings)
    private repo: Repository<GeneralSettings>,
  ) {}

  async getSettings() {
    const settings = await this.repo.findOne({ where: { id: 1 } });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  async updateSettings(data: Partial<GeneralSettings>) {
    const settings = await this.repo.findOne({ where: { id: 1 } });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    Object.assign(settings, data);

    return this.repo.save(settings);
  }
}