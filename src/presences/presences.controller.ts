import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { PresencesService } from "./presences.service";
import { Presences } from "./entities/presences.entity";

@Controller('presences')
export class PresencesController {
    constructor(private readonly presencesService: PresencesService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Presences>) {
        return this.presencesService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.presencesService.findAll();
    }

    @Get('countries')
    findAllCountry() {
        return this.presencesService.findAllCountry();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.presencesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Presences>,
    ) {
        return this.presencesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.presencesService.remove(id);
    }

}