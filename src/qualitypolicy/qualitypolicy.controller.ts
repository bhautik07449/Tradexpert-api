import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Patch,
    Query,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { QualitypolicyService } from './qualitypolicy.service';
import { Qualitypolicy } from './entities/qualitypolicy.entity';

@Controller('qualitypolicy')
export class QualityPolicyController {
    constructor(private readonly qualitypolicyService: QualitypolicyService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Qualitypolicy>) {
        return this.qualitypolicyService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country: string) {
        return this.qualitypolicyService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.qualitypolicyService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Qualitypolicy>,
    ) {
        return this.qualitypolicyService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.qualitypolicyService.remove(id);
    }
}