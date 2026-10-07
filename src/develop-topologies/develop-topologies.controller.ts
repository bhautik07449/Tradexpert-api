import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { DevelopTopologiesService } from "./develop-topologies.service";
import { DevelopTopology } from "./entities/develop-topology.entity";

@Controller('develop-topologies')
export class DevelopTopologiesController {
    constructor(private readonly developTopologiesService: DevelopTopologiesService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<DevelopTopology>) {
        return this.developTopologiesService.create(body);
    }

    @Get()
    findAll() {
        return this.developTopologiesService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.developTopologiesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<DevelopTopology>,
    ) {
        return this.developTopologiesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.developTopologiesService.remove(id);
    }
}