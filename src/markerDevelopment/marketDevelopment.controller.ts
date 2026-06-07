import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { MarketDevelopment } from "./entities/marketDevelopment.entity";
import { marketDevelopmentService } from "./marketDevelopment.service";

@Controller('marketdevelopment')
export class MarketDevelopmentController {
    constructor(private readonly marketDevelopmentService: marketDevelopmentService) { }

    @Post()
    create(@Body() body: Partial<MarketDevelopment>) {
        return this.marketDevelopmentService.create(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.marketDevelopmentService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.marketDevelopmentService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<MarketDevelopment>,
    ) {
        return this.marketDevelopmentService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.marketDevelopmentService.remove(id);
    }

}