import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { RequestInfoService } from "./requestInfo.service";
import { RequestInfo } from "./entities/requestInfo.entity";

@Controller('request_info')
export class RequestInfoController {
    constructor(private readonly requestInfoService: RequestInfoService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<RequestInfo>) {
        return this.requestInfoService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.requestInfoService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.requestInfoService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<RequestInfo>,
    ) {
        return this.requestInfoService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.requestInfoService.remove(id);
    }

}