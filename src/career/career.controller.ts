import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
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

    @Post('login')
    login(@Body() body: any) {
        return this.careerService.login(body);
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: any) {
        return this.careerService.forgotPassword(body);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: any) {
        return this.careerService.findOne(req.user.userId);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.careerService.findAll(country);
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