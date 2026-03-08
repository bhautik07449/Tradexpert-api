import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { HomebannerService } from "./homebanner.service";
import { Homebanner } from "./entities/homebanner.entity";

@Controller('homebanner')
export class HomebannerController {
    constructor(private readonly homebannerService: HomebannerService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Homebanner>) {
        return this.homebannerService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.homebannerService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.homebannerService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Homebanner>,
    ) {
        return this.homebannerService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.homebannerService.remove(id);
    }

}