import { Controller, Post, Body, Get, Patch, Delete, UseGuards, ParseIntPipe, Param, Request, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from 'src/auth/dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { AdminDto } from './dto/admin.dto';
import { Transactional } from 'typeorm-transactional';
import { plainToInstance } from 'class-transformer';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    async registerAdmin(@Body() createAdminDto: RegisterAdminDto): Promise<{ success: boolean; message: string; data: AdminDto }> {
        const result = await this.adminService.createAdmin(createAdminDto);
        return {
            success: result.success,
            message: result.message,
            data: plainToInstance(AdminDto, result.data, { excludeExtraneousValues: true }),
        };
    }

    @Get()
    @UseGuards(AdminAuthGuard)
    async findAll(@Query('country') country?:string): Promise<AdminDto[]> {
        return await this.adminService.getAdmins(country);
    }

    @Get('profile')
    @UseGuards(AdminAuthGuard)
    async getProfile(@Request() request: any): Promise<AdminDto> {
        const userId = request.user.userId;
        return await this.adminService.getAdminById(userId);
    }

    @Get('/:adminId')
    @UseGuards(AdminAuthGuard)
    async getAdminById(@Param() param): Promise<AdminDto> {
        const id = Number(param.adminId);
        return await this.adminService.getAdminById(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    async updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto
    ): Promise<AdminDto> {
        const admin = await this.adminService.updateAdminById(id, updateAdminDto);
        return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
    }

    @Post('editProfile')
    @UseGuards(AdminAuthGuard)
    async editProfile(
        @Request() request: any,
        @Body() editProfileDto: EditProfileDto
    ): Promise<AdminDto> {
        const userId = request.user.userId;

        const admin = await this.adminService.updateAdminProfile(
            userId,
            editProfileDto
        );

        return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }
}