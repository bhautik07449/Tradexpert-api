import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { DRMService } from './dmr.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('dmr')
export class DMRController {
    constructor(private readonly dmrService: DRMService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: any) {
        return this.dmrService.create(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.dmrService.findAll(country);
    }

    @Get('market-data')
    getAllMarketData() {
        return this.dmrService.getAllMarketData();
    }

    @Get('market-data/category')
    getAllMarketDataByCategory(
        @Query('category') category: string,
        @Query('subCategory') subCategory?: string,
    ) {
        return this.dmrService.getAllMarketDataByCategory(+category, subCategory ? +subCategory : undefined);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.dmrService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(@Param('id') id: number, @Body() body: any) {
        return this.dmrService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    delete(@Param('id') id: number) {
        return this.dmrService.delete(id);
    }
}