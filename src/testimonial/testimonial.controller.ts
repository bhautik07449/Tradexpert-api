import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { Testimonial } from "./entities/testimonial.entity";
import { TestimonialService } from "./testimonial.service";

@Controller('testimonial')
export class TestimonialController {
    constructor(private readonly testimonialService: TestimonialService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Testimonial>) {
        return this.testimonialService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country) {
        return this.testimonialService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.testimonialService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Testimonial>,
    ) {
        return this.testimonialService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.testimonialService.remove(id);
    }

}