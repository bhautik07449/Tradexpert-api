import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { TradetypeService } from "./tradetype.service";
import { Tradetype } from "./entities/tradetype.entity";

@Controller('tradetype')
export class TradetypeController {
    constructor(private readonly tradetypeService: TradetypeService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Tradetype>) {
        return this.tradetypeService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.tradetypeService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tradetypeService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Tradetype>,
    ) {
        return this.tradetypeService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tradetypeService.remove(id);
    }

}