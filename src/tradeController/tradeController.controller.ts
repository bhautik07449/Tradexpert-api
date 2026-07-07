import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TradeControllerService } from './tradeController.service';
import { TradeControllerEntity } from './entities/tradeController.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('trade_controller')
export class TradeController {
    constructor(private readonly tradeService: TradeControllerService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<TradeControllerEntity>) {
        return this.tradeService.create(body);
    }

    @Get()
    findAll(
        @Query('hsn_code') hsn_code?: string,
        @Query('description') description?: string,
    ) {
        return this.tradeService.findAll(hsn_code, description);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tradeService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<TradeControllerEntity>,
    ) {
        return this.tradeService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tradeService.remove(id);
    }
}
