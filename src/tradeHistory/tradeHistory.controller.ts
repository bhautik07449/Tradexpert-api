import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { TradeHistory } from "./entities/tradeHistory.entity";
import { TradeHistoryService } from "./tradeHistory.service";

@Controller('tradehistory')
export class TradeHistoryController {
    constructor(private readonly tradeHistoryService: TradeHistoryService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<TradeHistory>) {
        return this.tradeHistoryService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.tradeHistoryService.findAll(country);
    }

    @Get('/country')
    // @UseGuards(AdminAuthGuard)
    findByCountryQuery(@Query('country') country?: string) {
        return this.tradeHistoryService.findByCountry(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tradeHistoryService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<TradeHistory>,
    ) {
        return this.tradeHistoryService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tradeHistoryService.remove(id);
    }

}