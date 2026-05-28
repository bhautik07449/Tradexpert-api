import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { FinancialService } from "./financialservice.service";
import { Financial } from "./entities/financialservice.entity";

@Controller('financialservice')
export class FinacialController {
    constructor(private readonly finacialService: FinancialService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Financial>) {
        return this.finacialService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.finacialService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.finacialService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Financial>,
    ) {
        return this.finacialService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.finacialService.remove(id);
    }

}