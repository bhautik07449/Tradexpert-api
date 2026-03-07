import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
} from '@nestjs/common';
import { DRMService } from './dmr.service';

@Controller('dmr')
export class DMRController {
    constructor(private readonly dmrService: DRMService) { }

    @Post()
    create(@Body() body: any) {
        return this.dmrService.create(body);
    }

    @Get()
    findAll() {
        return this.dmrService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.dmrService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.dmrService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.dmrService.delete(id);
    }
}