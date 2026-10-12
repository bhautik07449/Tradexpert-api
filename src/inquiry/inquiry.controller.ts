import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { AdminOrSupplierAuthGuard } from "src/auth/admin-or-supplier-auth.guard";
import { InquiryService } from "./inquiry.service";
import { Inquiry } from "./entities/inquiry.entity";

@Controller('inquiry')
export class InquiryController {
    constructor(private readonly inquiryService: InquiryService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: Partial<Inquiry>, @Req() req: any) {
        if (req.user?.supplierId && !body.supplier_id) {
            body.supplier_id = req.user.supplierId;
        }
        if (req.user?.name && !body.supplier_name) {
            body.supplier_name = req.user.name;
        }
        return this.inquiryService.create(body);
    }

    @Get()
    @UseGuards(AdminOrSupplierAuthGuard)
    findAll(@Query('country') country?: string, @Query('supplier_id') supplier_id?: number, @Req() req?: any) {
        const supId = req?.user?.supplierId || supplier_id;
        return this.inquiryService.findAll(country, supId);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.inquiryService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Inquiry>,
    ) {
        return this.inquiryService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.inquiryService.remove(id);
    }

}