import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { MarketData } from "./entities/marketData.entity";
import { MarketDataService } from "./marketData.service";

@Controller('marketdata')
export class MarketDataController {
    constructor(private readonly marketDataService: MarketDataService) { }

    @Post()
    create(@Body() body: Partial<MarketData>) {
        return this.marketDataService.create(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.marketDataService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.marketDataService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<MarketData>,
    ) {
        return this.marketDataService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.marketDataService.remove(id);
    }

}