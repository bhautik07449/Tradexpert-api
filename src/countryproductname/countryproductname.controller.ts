import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { Countryproductname } from "./entities/countryproductname.entity";
import { CountryproductnameService } from "./countryproductname.service";

@Controller('countryproductname')
export class CountryproductnameController {
    constructor(private readonly countryproductnameService: CountryproductnameService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Countryproductname>) {
        return this.countryproductnameService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.countryproductnameService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.countryproductnameService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Countryproductname>,
    ) {
        return this.countryproductnameService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.countryproductnameService.remove(id);
    }

}