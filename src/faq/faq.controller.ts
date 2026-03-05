import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { FaqService } from "./faq.service";
import { Faq } from "./entities/faq.entity";

@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Faq>) {
        return this.faqService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.faqService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.faqService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Faq>,
    ) {
        return this.faqService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.faqService.remove(id);
    }

}