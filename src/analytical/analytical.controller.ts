import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { AnalyticalService } from "./analytical.service";
import { Analytical } from "./entities/analytical.entity";

@Controller('analytical')
export class AnalyticalController {
    constructor(private readonly analyticalService: AnalyticalService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Analytical>) {
        return this.analyticalService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.analyticalService.findAll();
    }

    @Get('/country')
    // @UseGuards(AdminAuthGuard)
    findByCountryQuery(@Query('country') country?: string) {
        return this.analyticalService.findByCountry(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.analyticalService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Analytical>,
    ) {
        return this.analyticalService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.analyticalService.remove(id);
    }

}