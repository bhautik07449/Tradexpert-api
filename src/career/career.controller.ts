import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { CareerService } from "./career.service";
import { Career } from "./entities/career.entity";

@Controller('career')
export class CareerController {
    constructor(private readonly careerService: CareerService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Career>) {
        return this.careerService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.careerService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.careerService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Career>,
    ) {
        return this.careerService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.careerService.remove(id);
    }

}