import { Controller, Post, Body, Get, Patch, Delete, UseGuards, ParseIntPipe, Param, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    @Transactional()
    @UseGuards(AdminAuthGuard)
    // @UseGuards(IdempotencyGuard)
    async registerAdmin(@UploadedFile() file: Express.Multer.File, @Body() createAdminDto: RegisterAdminDto): Promise<AdminDto> {
        const admin = await this.adminService.createAdmin(createAdminDto, file ? file.path : '');
        return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
    }

    @Get()
    @Transactional()
    @UseGuards(AdminAuthGuard)
    async findAll(): Promise<AdminDto[]> {
        return await this.adminService.getAdmins();
    }

    @Get('profile')
    @Transactional()
    @UseGuards(AdminAuthGuard)
    async getProfile(@Request() request: any): Promise<AdminDto> {
        // Get current logged-in admin ID from JWT token (set by AdminAuthGuard)
        const userId = request.user.userId;
        return await this.adminService.getAdminById(userId);
    }

    @Get('/:adminId')
    @Transactional()
    @UseGuards(AdminAuthGuard)
    async getAdminById(@Param() param): Promise<AdminDto> {
        const id = Number(param.adminId);
        return await this.adminService.getAdminById(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    @Transactional()
    @UseGuards(AdminAuthGuard)
    async updateAdmin(@Param('id', ParseIntPipe) id: number,@UploadedFile() file: Express.Multer.File,@Body() updateAdminDto: UpdateAdminDto): Promise<AdminDto> {
        const admin = await this.adminService.updateAdminById(id, updateAdminDto, file ? file.path : undefined);
        return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
    }

    @Post('editProfile')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    @Transactional()
    @UseGuards(AdminAuthGuard)
    async editProfile(
        @Request() request: any,
        @UploadedFile() file: Express.Multer.File,
        @Body() editProfileDto: EditProfileDto
    ): Promise<AdminDto> {
        // Get current logged-in admin ID from JWT token (set by AdminAuthGuard)
        const userId = request.user.userId;
        // Only allow updating firstName, lastName, and photo (email/phone are NOT allowed)
        const admin = await this.adminService.updateAdminProfile(
            userId,
            {
                firstName: editProfileDto.firstName,
                lastName: editProfileDto.lastName,
            },
            file ? file.path : undefined
        );
        return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
    }
}

