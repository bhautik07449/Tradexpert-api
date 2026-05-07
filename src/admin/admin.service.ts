import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminStatus } from './entities/admin.entity';
import { RegisterAdminDto } from 'src/auth/dto/register-admin.dto';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { plainToInstance } from 'class-transformer';
import { AdminDto } from './dto/admin.dto';
import { EmailService } from 'src/common/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly emailService: EmailService,
  ) { }

  async createAdmin(dto: RegisterAdminDto): Promise<Admin> {

    const existingAdminByEmail = await this.adminRepository.findOne({
      where: { email: dto.email },
    });

    if (existingAdminByEmail) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`);
    }

    const existingAdminByPhone = await this.adminRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingAdminByPhone) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = this.adminRepository.create({
      ...dto,
      password: hashedPassword,
      status: AdminStatus.ACTIVE,
    });

    return await this.adminRepository.save(admin);
  }

  async getAdminById(id: number): Promise<AdminDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`, 'Admin', AdminService.name, 'getAdminById');
    }
    return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with email id ${email} not found.`, 'Admin', AdminService.name, 'getAdminByEmail');
    }
    return admin;
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async getAdmins(): Promise<AdminDto[]> {
    const admins = await this.adminRepository.find();
    return plainToInstance(AdminDto, admins, { excludeExtraneousValues: true });
  }

  async updateAdminById(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`);
    }

    const { password, ...updateData } = dto;
    Object.assign(admin, updateData);

    if (password && password.trim() !== '') {
      admin.password = await bcrypt.hash(password, 10);
    }

    return this.adminRepository.save(admin);
  }


  async updateAdminProfile(
    id: number,
    dto: { firstName?: string; lastName?: string; photo?: string; password?: string }
  ): Promise<Admin> {

    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`);
    }

    if (dto.firstName !== undefined) admin.firstName = dto.firstName;
    if (dto.lastName !== undefined) admin.lastName = dto.lastName;
    if (dto.photo !== undefined) admin.photo = dto.photo;

    if (dto.password && dto.password.trim() !== '') {
      admin.password = await bcrypt.hash(dto.password, 10);
    }

    return this.adminRepository.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) throw new NotFoundException('This Admin user not found');

    await this.adminRepository.remove(admin);

    return {
      success: true,
      message: 'Admi user deleted successfully',
    };
  }
}

