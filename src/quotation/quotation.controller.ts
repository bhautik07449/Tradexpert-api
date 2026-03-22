import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { QuotationService } from "./quotation.service";
import { Quotation } from "./entities/quotation.entity";

@Controller('quotation')
export class QuotationController {
    constructor(private readonly quotationService: QuotationService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Quotation>) {
        return this.quotationService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.quotationService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.quotationService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Quotation>,
    ) {
        return this.quotationService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.quotationService.remove(id);
    }

}