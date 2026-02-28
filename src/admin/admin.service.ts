import { Injectable } from '@nestjs/common';
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

  async createAdmin(dto: RegisterAdminDto, photoPath: string): Promise<Admin> {
    const existingAdminByEmail = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (existingAdminByEmail) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`, 'Admin', AdminService.name);
    }

    const existingAdminByPhone = await this.adminRepository.findOne({
      where: { phone: dto.phone },
    });
    if (existingAdminByPhone) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`, 'Admin', AdminService.name);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepository.create({
      ...dto,
      password: hashedPassword,
      photo: photoPath,
      status: AdminStatus.ACTIVE,
    });
    const savedAdmin = await this.adminRepository.save(admin);

    // Send account created email (placeholder implementation)
    try {
      await this.emailService.sendAccountCreatedEmail({
        email: savedAdmin.email,
        firstName: savedAdmin.firstName,
        lastName: savedAdmin.lastName,
        // TODO: Get base URL from config service
        // loginUrl: `${baseUrl}/admin/login`,
      });
    } catch (error) {
      // Log error but don't fail the creation if email fails
      // In production, you might want to queue this for retry
      console.error('Failed to send account created email:', error);
    }

    return savedAdmin;
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

  async updateAdminById(id: number, dto: UpdateAdminDto, photoPath?: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`, 'Admin', AdminService.name, 'updateAdminById');
    }

    // Check email uniqueness if email is being updated
    if (dto.email && dto.email !== admin.email) {
      const existingAdminByEmail = await this.adminRepository.findOne({
        where: { email: dto.email },
      });
      if (existingAdminByEmail) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`, 'Admin', AdminService.name);
      }
    }

    // Check phone uniqueness if phone is being updated
    if (dto.phone && dto.phone !== admin.phone) {
      const existingAdminByPhone = await this.adminRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingAdminByPhone) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`, 'Admin', AdminService.name);
      }
    }

    // Update fields
    if (dto.firstName !== undefined) admin.firstName = dto.firstName;
    if (dto.lastName !== undefined) admin.lastName = dto.lastName;
    if (dto.email !== undefined) admin.email = dto.email;
    if (dto.phone !== undefined) admin.phone = dto.phone;
    if (dto.status !== undefined) admin.status = dto.status as AdminStatus;
    if (photoPath !== undefined) admin.photo = photoPath;

    return this.adminRepository.save(admin);
  }

  async updateAdminProfile(id: number, dto: { firstName?: string; lastName?: string }, photoPath?: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`, 'Admin', AdminService.name, 'updateAdminProfile');
    }

    // Only allow updating firstName, lastName, and photo
    // Email and phone are NOT allowed 
    if (dto.firstName !== undefined) admin.firstName = dto.firstName;
    if (dto.lastName !== undefined) admin.lastName = dto.lastName;
    if (photoPath !== undefined) admin.photo = photoPath;

    return this.adminRepository.save(admin);
  }
}

