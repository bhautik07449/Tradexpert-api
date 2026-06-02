import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { ESGService } from "./ESG.service";
import { ESG } from "./entities/ESG.entity";

@Controller('esg')
export class ESGController {
    constructor(private readonly esgService: ESGService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<ESG>) {
        return this.esgService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(
        @Query('country') country?: string,
        @Query('category') category?: string,
        @Query('tag') tag?: string,
    ) {
        return this.esgService.findAll(country, category, tag);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.esgService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<ESG>,
    ) {
        return this.esgService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.esgService.remove(id);
    }

}