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
import { InvestorsService } from './investors.service';
import { Investor } from './entities/investor.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('investors')
export class InvestorsController {
    constructor(private readonly investorsService: InvestorsService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Investor>) {
        return this.investorsService.create(body);
    }

    @Post('login')
    login(@Body() body: any) {
        return this.investorsService.login(body);
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: any) {
        return this.investorsService.forgotPassword(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.investorsService.findAll(country);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.investorsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Investor>,
    ) {
        return this.investorsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.investorsService.remove(id);
    }
}
