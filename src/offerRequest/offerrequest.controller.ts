import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    Request,
} from '@nestjs/common';
import { OfferRequestService } from './offerrequest.service';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('offerrequest')
export class OfferRequestController {
    constructor(private readonly service: OfferRequestService) { }

    @Post()
    create(@Body() body: any, @Request() req: any) {
        return this.service.create(body, req?.user);
    }

    @Get()
    @UseGuards(AdminOrSupplierAuthGuard)
    findAll(@Query('country') country?: string, @Request() req?: any) {
        return this.service.findAll(country, req?.user);
    }

    @Get(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @Request() req?: any,
    ) {
        return this.service.update(id, body, req?.user);
    }

    @Delete(':id')
    @UseGuards(AdminOrSupplierAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}