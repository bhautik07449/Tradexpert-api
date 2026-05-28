import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { Affiliation } from "./entities/affiliation.entity";
import { AffiliationService } from "./affiliation.service";

@Controller('affiliation')
export class AffiliationController {
    constructor(private readonly affiliationService: AffiliationService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Affiliation>) {
        return this.affiliationService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country: string) {
        return this.affiliationService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.affiliationService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Affiliation>,
    ) {
        return this.affiliationService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.affiliationService.remove(id);
    }

}