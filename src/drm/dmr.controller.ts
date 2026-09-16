import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    Query,
    Request,
} from '@nestjs/common';
import { DRMService } from './dmr.service';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('dmr')
export class DMRController {
    constructor(private readonly dmrService: DRMService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: any, @Request() req: any) {
        return this.dmrService.create(body, req?.user);
    }

    @Get()
    findAll(@Query('country') country?: string, @Request() req?: any) {
        return this.dmrService.findAll(country, req?.user);
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
    @UseGuards(AdminOrSupplierAuthGuard)
    update(@Param('id') id: number, @Body() body: any, @Request() req: any) {
        return this.dmrService.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    delete(@Param('id') id: number) {
        return this.dmrService.delete(id);
    }
}