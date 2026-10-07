import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { DevelopPrepositionsService } from "./develop-prepositions.service";
import { DevelopPreposition } from "./entities/develop-preposition.entity";

@Controller('develop-prepositions')
export class DevelopPrepositionsController {
    constructor(private readonly developPrepositionsService: DevelopPrepositionsService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<DevelopPreposition>) {
        return this.developPrepositionsService.create(body);
    }

    @Get()
    findAll() {
        return this.developPrepositionsService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.developPrepositionsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<DevelopPreposition>,
    ) {
        return this.developPrepositionsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.developPrepositionsService.remove(id);
    }
}