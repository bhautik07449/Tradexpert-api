import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { NewsletterService } from "./newsletter.service";
import { Newsletter } from "./entities/newsletter.entity";

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Newsletter>) {
        return this.newsletterService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.newsletterService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.newsletterService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Newsletter>,
    ) {
        return this.newsletterService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.newsletterService.remove(id);
    }

}