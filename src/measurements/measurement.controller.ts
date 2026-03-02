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
} from '@nestjs/common';
import { MeasurementService } from './measurements.service';
import { Measurement } from './entities/measurement.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('measurements')
export class MeasurementController {
    constructor(private readonly measurementService: MeasurementService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Measurement>) {
        return this.measurementService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll() {
        return this.measurementService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.measurementService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Measurement>,
    ) {
        return this.measurementService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.measurementService.remove(id);
    }
}