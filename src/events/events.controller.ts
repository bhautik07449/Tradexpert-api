import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { EventsService } from "./events.service";
import { Events } from "./entities/events.entity";

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Events>) {
        return this.eventsService.create(body);
    }

    @Get()
    // @UseGuards(AdminAuthGuard)
    findAll() {
        return this.eventsService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Events>,
    ) {
        return this.eventsService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.eventsService.remove(id);
    }

}