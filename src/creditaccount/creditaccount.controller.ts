import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { CreditAccountService } from './creditaccount.service';
import { CreditAccount } from './entity/creditaccount.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('creditaccount')
export class CreditAccountController {
    constructor(private readonly creditAccountService: CreditAccountService) { }

    @Post()
    create(@Body() body: CreditAccount) {
        return this.creditAccountService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.creditAccountService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id') id: string) {
        return this.creditAccountService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(@Param('id') id: string, @Body() body: Partial<CreditAccount>) {
        return this.creditAccountService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id') id: string) {
        return this.creditAccountService.remove(id);
    }
}