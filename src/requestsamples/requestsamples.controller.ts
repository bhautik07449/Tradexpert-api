import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { Requestsamples } from "./entities/requestsamples.entity";
import { RequestsamplesService } from "./requestsamples.service";

@Controller('requestsamples')
export class RequestsamplesController {
    constructor(private readonly requestsamplesService: RequestsamplesService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Requestsamples>) {
        return this.requestsamplesService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.requestsamplesService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.requestsamplesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Requestsamples>,
    ) {
        return this.requestsamplesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.requestsamplesService.remove(id);
    }

}