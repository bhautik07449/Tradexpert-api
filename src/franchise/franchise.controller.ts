import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { FranchiseService } from "./franchise.service";
import { Franchise } from "./entities/franchise.entity";

@Controller('franchise')
export class FranchiseController {
    constructor(private readonly franchiseService: FranchiseService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Franchise>) {
        return this.franchiseService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.franchiseService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.franchiseService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Franchise>,
    ) {
        return this.franchiseService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.franchiseService.remove(id);
    }

}