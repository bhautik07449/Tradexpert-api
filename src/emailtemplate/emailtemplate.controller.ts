import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { EmailTemplate } from "./entities/emailtemplate.entity";
import { EmailTemplateService } from "./emailtemplate.service";

@Controller('emailtemplate')
export class EmailTemplateController {
    constructor(private readonly emailtemplateService: EmailTemplateService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<EmailTemplate>) {
        return this.emailtemplateService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.emailtemplateService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.emailtemplateService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<EmailTemplate>,
    ) {
        return this.emailtemplateService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.emailtemplateService.remove(id);
    }

}