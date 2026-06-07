import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { InvestorrelationsService } from "./investorrelations.service";
import { Investorrelations } from "./entities/investorrelations.entity";

@Controller('investorrelations')
export class InvestorrelationsController {
    constructor(private readonly InvestorrelationsService: InvestorrelationsService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Investorrelations>) {
        return this.InvestorrelationsService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.InvestorrelationsService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.InvestorrelationsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Investorrelations>,
    ) {
        return this.InvestorrelationsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.InvestorrelationsService.remove(id);
    }

}