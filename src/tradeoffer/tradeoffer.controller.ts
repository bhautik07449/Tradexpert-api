import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Query,
    Request,
} from '@nestjs/common';
import { TradeofferService } from './tradeoffer.service';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';

@Controller('tradeoffer')
export class TradeofferController {
    constructor(private readonly service: TradeofferService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: any, @Request() req: any) {
        return this.service.create(body, req?.user);
    }

    @Get()
    findAll(@Query('country') country: string, @Request() req: any) {
        return this.service.findAll(country, req?.user);
    }

    @Get('country')
    findAllByCountry(@Query('country') country: string) {
        return this.service.findAllByCountry(country);
    }

    @Get('grouped/:id')
    getGroupedProductsByTradeoffer(@Param('id', ParseIntPipe) id: number) {
        return this.service.getGroupedProductsByTradeoffer(id);
    }

    @Get(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @Request() req: any,
    ) {
        return this.service.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}