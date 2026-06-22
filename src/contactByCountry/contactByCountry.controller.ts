import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { ContactNoService } from "./contactByCountry.service";
import { ContactNo } from "./entities/contactByCountry.entity";

@Controller('contactno')
export class ContactNoController {
    constructor(private readonly contactnoService: ContactNoService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<ContactNo>) {
        return this.contactnoService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.contactnoService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.contactnoService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<ContactNo>,
    ) {
        return this.contactnoService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.contactnoService.remove(id);
    }

}