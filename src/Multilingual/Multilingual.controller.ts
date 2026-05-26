import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { MultilingualService } from "./Multilingual.service";
import { Multilingual } from "./entities/Multilingual.entity";

@Controller('multilingual')
export class MultilingualController {
    constructor(private readonly multilingualService: MultilingualService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Multilingual>) {
        return this.multilingualService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.multilingualService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.multilingualService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Multilingual>,
    ) {
        return this.multilingualService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.multilingualService.remove(id);
    }

}