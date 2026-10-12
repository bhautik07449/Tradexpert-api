import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminOrSupplierAuthGuard } from "src/auth/admin-or-supplier-auth.guard";
import { InterwatchAlertService } from "./interwatch-alert.service";
import { InterwatchAlert } from "./entities/interwatch-alert.entity";

@Controller('interwatch-alert')
export class InterwatchAlertController {
    constructor(private readonly interwatchAlertService: InterwatchAlertService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: Partial<InterwatchAlert>, @Req() req: any) {
        return this.interwatchAlertService.create(body, req.user);
    }

    @Get('stats')
    getStats() {
        return this.interwatchAlertService.getStats();
    }

    @Get()
    findAll(
        @Query('alert_type') alert_type?: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('supplier_id') supplier_id?: number,
    ) {
        return this.interwatchAlertService.findAll({ alert_type, category, search, supplier_id });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.interwatchAlertService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<InterwatchAlert>,
    ) {
        return this.interwatchAlertService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.interwatchAlertService.remove(id);
    }
}
