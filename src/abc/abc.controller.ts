import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { AbcService } from './abc.service';

@Controller('abc')
export class AbcController {
    constructor(private readonly service: AbcService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.service.findAll(country);
    }

    @Get('/grouped')
    // @UseGuards(AdminAuthGuard)
    groupedData(@Query('country') country?: string) {
        return this.service.groupedData(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
    ) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}