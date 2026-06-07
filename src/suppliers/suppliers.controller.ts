import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Patch,
    Query,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Supplier>) {
        return this.suppliersService.create(body);
    }

    @Post('login')
    login(@Body() body: any) {
        return this.suppliersService.login(body);
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: any) {
        return this.suppliersService.forgotPassword(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.suppliersService.findAll(country);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Supplier>,
    ) {
        return this.suppliersService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.remove(id);
    }
}