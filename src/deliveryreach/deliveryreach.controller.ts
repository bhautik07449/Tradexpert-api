import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { DeliveryReachService } from "./deliveryreach.service";
import { DeliveryReach } from "./entities/deliveryreach.entity";

@Controller('deliveryreach')
export class DeliveryreachController {
    constructor(private readonly deliveryreachService: DeliveryReachService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<DeliveryReach>) {
        return this.deliveryreachService.create(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.deliveryreachService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deliveryreachService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<DeliveryReach>,
    ) {
        return this.deliveryreachService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.deliveryreachService.remove(id);
    }

}