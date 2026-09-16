import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { TradetypeService } from "./tradetype.service";
import { Tradetype } from "./entities/tradetype.entity";
import { AdminOrSupplierAuthGuard } from "src/auth/admin-or-supplier-auth.guard";

@Controller('tradetype')
export class TradetypeController {
    constructor(private readonly tradetypeService: TradetypeService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: Partial<Tradetype>, @Request() req: any) {
        return this.tradetypeService.create(body, req?.user);
    }

    @Get()
    @UseGuards(AdminOrSupplierAuthGuard)
    findAll(@Query('country') country?: string, @Request() req?: any) {
        return this.tradetypeService.findAll(country, req?.user);
    }

    @Get(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tradetypeService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Tradetype>,
        @Request() req?: any,
    ) {
        return this.tradetypeService.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.tradetypeService.remove(id);
    }

}