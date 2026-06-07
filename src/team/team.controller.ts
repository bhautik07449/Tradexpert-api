import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { TeamService } from "./team.service";
import { Team } from "./entities/team.entity";

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Post()
    @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Team>) {
        return this.teamService.create(body);
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    findAll(@Query('country') country?:string) {
        return this.teamService.findAll(country);
    }

    @Get(':id')
    @UseGuards(AdminAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.teamService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Team>,
    ) {
        return this.teamService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.teamService.remove(id);
    }

}