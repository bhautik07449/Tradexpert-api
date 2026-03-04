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
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { OfferRequestService } from './offerrequest.service';

@Controller('offerrequest')
export class OfferRequestController {
    constructor(private readonly service: OfferRequestService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.service.findAll();
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