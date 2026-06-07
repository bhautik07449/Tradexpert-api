import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { ClientService } from "./client.service";
import { Client } from "./entities/client.entity";

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Client>) {
        return this.clientService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.clientService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.clientService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Client>,
    ) {
        return this.clientService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.clientService.remove(id);
    }

}