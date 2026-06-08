import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './entities/currency.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Currency>) {
        return this.currencyService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.currencyService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.currencyService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Currency>,
    ) {
        return this.currencyService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.currencyService.remove(id);
    }
}