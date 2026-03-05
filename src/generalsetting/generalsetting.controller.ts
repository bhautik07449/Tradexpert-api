import { Controller, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { GeneralSettingsService } from './generalsetting.service';
import { GeneralSettings } from './entities/generalsetting.entity';

@Controller('general_settings')
export class GeneralSettingsController {

    constructor(private readonly service: GeneralSettingsService) { }

    @Get()
    @UseGuards(AdminAuthGuard)
    getSettings() {
        return this.service.getSettings();
    }

    @Patch()
    updateSettings(@Body() body: Partial<GeneralSettings>) {
        return this.service.updateSettings(body);
    }
}