import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { ElearningApiKeyService } from "./ElearningApiKey.service";
import { ElearningApiKey } from "./entities/ElearningApiKey.entity";

@Controller('apikey')
export class ElearningApiKeyController {
    constructor(private readonly apikeyService: ElearningApiKeyService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<ElearningApiKey>) {
        return this.apikeyService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.apikeyService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.apikeyService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<ElearningApiKey>,
    ) {
        return this.apikeyService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.apikeyService.remove(id);
    }

}