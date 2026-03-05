import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { CertificationsliderService } from "./certificationslider.service";
import { Certificationslider } from "./entities/certificationslider.entity";

@Controller('certificationslider')
export class CertificationsliderController {
    constructor(private readonly certificationsliderService: CertificationsliderService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Certificationslider>) {
        return this.certificationsliderService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.certificationsliderService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.certificationsliderService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Certificationslider>,
    ) {
        return this.certificationsliderService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.certificationsliderService.remove(id);
    }

}