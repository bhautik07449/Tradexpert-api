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
import { AbcService } from './abc.service';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('abc')
export class AbcController {
    constructor(private readonly service: AbcService) { }

    @Post()
    @UseGuards(AdminOrSupplierAuthGuard)
    create(@Body() body: any, @Request() req: any) {
        return this.service.create(body, req?.user);
    }

    @Get()
    findAll(@Query('country') country?: string, @Request() req?: any) {
        return this.service.findAll(country, req?.user);
    }

    @Get('/grouped')
    groupedData(@Query('country') country?: string) {
        return this.service.groupedData(country);
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