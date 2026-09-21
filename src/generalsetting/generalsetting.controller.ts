import { Controller, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { AdminOrServiceAuthGuard } from 'src/auth/admin-or-service-auth.guard';
import { GeneralSettingsService } from './generalsetting.service';
import { GeneralSettings } from './entities/generalsetting.entity';

@Controller('general_settings')
export class GeneralSettingsController {

    constructor(private readonly service: GeneralSettingsService) { }

    @Get()
    @UseGuards(AdminOrServiceAuthGuard)
    getSettings() {
        return this.service.getSettings();
    }

    @Patch()
    @UseGuards(AdminOrServiceAuthGuard)
    updateSettings(@Body() body: Partial<GeneralSettings>) {
        return this.service.updateSettings(body);
    }
}