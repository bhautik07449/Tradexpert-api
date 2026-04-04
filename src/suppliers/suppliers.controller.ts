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

    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Supplier>,
    ) {
        return this.suppliersService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.remove(id);
    }
}