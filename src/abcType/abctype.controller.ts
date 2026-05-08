import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { Abctype } from "./entities/abctype.entity";
import { AbctypeService } from "./abctype.service";

@Controller('abctype')
export class AbctypeController {
    constructor(private readonly abctypeService: AbctypeService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Abctype>) {
        return this.abctypeService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.abctypeService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.abctypeService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Abctype>,
    ) {
        return this.abctypeService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.abctypeService.remove(id);
    }

}