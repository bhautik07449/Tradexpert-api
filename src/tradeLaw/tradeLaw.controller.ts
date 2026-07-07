import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TradeLawService } from './tradeLaw.service';
import { TradeLawEntity } from './entities/tradeLaw.entity';

@Controller('trade_law')
export class TradeLawController {
    constructor(private readonly tradeLawService: TradeLawService) {}

    @Post()
    create(@Body() body: Partial<TradeLawEntity>) {
        return this.tradeLawService.create(body);
    }

    @Get()
    findAll(@Query('department') department?: string) {
        return this.tradeLawService.findAll(department);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tradeLawService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<TradeLawEntity>,
    ) {
        return this.tradeLawService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tradeLawService.remove(id);
    }
}