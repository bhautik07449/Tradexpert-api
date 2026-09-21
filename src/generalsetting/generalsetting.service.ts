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
    let settings = await this.repo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = await this.repo.save(this.repo.create({ id: 1 }));
    }
    return settings;
  }

  async updateSettings(data: Partial<GeneralSettings>) {
    let settings = await this.repo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.repo.create({ id: 1, ...data });
    } else {
      Object.assign(settings, data);
    }
    return this.repo.save(settings);
  }
}