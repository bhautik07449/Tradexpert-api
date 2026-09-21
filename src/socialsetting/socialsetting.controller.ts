import { Controller, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { AdminOrServiceAuthGuard } from 'src/auth/admin-or-service-auth.guard';
import { SocialSettingsService } from './socialsetting.service';
import { SocialSettings } from './entities/socialsetting.entity';

@Controller('social_settings')
export class SocialSettingsController {

    constructor(private readonly service: SocialSettingsService) { }

    @Get()
    @UseGuards(AdminOrServiceAuthGuard)
    getSettings() {
        return this.service.getSettings();
    }

    @Patch()
    @UseGuards(AdminOrServiceAuthGuard)
    updateSettings(@Body() body: Partial<SocialSettings>) {
        return this.service.updateSettings(body);
    }
}