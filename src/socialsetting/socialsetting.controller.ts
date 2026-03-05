import { Controller, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { SocialSettingsService } from './socialsetting.service';
import { SocialSettings } from './entities/socialsetting.entity';

@Controller('social_settings')
export class SocialSettingsController {

    constructor(private readonly service: SocialSettingsService) { }

    @Get()
    @UseGuards(AdminAuthGuard)
    getSettings() {
        return this.service.getSettings();
    }

    @Patch()
    updateSettings(@Body() body: Partial<SocialSettings>) {
        return this.service.updateSettings(body);
    }
}