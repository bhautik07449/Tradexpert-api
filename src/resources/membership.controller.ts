import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { MembershipService } from "./membership.service";
import { Membership } from "./entities/membership.entity";

@Controller('membership')
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Membership>) {
        return this.membershipService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.membershipService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.membershipService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Membership>,
    ) {
        return this.membershipService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.membershipService.remove(id);
    }

}