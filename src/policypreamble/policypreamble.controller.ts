import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { PolicyPreambleService } from "./policypreamble.service";
import { PolicyPreamble } from "./entities/policypreamble.entity";

@Controller('policypreamble')
export class PolicyPreambleController {
    constructor(private readonly policypreambleService: PolicyPreambleService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<PolicyPreamble>) {
        return this.policypreambleService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?: string) {
        return this.policypreambleService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.policypreambleService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<PolicyPreamble>,
    ) {
        return this.policypreambleService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.policypreambleService.remove(id);
    }

}