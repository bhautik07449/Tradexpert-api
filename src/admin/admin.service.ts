import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Admin, AdminStatus, AdminRole } from './entities/admin.entity';
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

  async createAdmin(dto: RegisterAdminDto): Promise<{ success: boolean; message: string; data: Admin }> {
    const targetRole = dto.role || AdminRole.SUPER_ADMIN;

    if (targetRole === AdminRole.SUPER_ADMIN) {
      const existingSuperAdmin = await this.adminRepository.findOne({
        where: { role: AdminRole.SUPER_ADMIN, status: Not(AdminStatus.DELETED) },
      });
      if (existingSuperAdmin) {
        throw new BusinessException(
          ErrorCodes.ERR_RC_002,
          'Only one Super Admin account can exist in the system.',
        );
      }
    }

    const existingAdminByEmail = await this.adminRepository.findOne({
      where: { email: dto.email, status: Not(AdminStatus.DELETED) },
    });

    if (existingAdminByEmail) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`);
    }

    const existingAdminByPhone = await this.adminRepository.findOne({
      where: { phone: dto.phone, status: Not(AdminStatus.DELETED) },
    });

    if (existingAdminByPhone) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = this.adminRepository.create({
      ...dto,
      role: targetRole,
      password: hashedPassword,
      status: AdminStatus.ACTIVE,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    return {
      success: true,
      message: 'Admin created successfully',
      data: savedAdmin,
    };
  }

  async getAdminById(id: number): Promise<AdminDto> {
    const admin = await this.adminRepository.findOne({ where: { id, status: Not(AdminStatus.DELETED) } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`, 'Admin', AdminService.name, 'getAdminById');
    }
    return plainToInstance(AdminDto, admin, { excludeExtraneousValues: true });
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email, status: Not(AdminStatus.DELETED) } });
    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with email id ${email} not found.`, 'Admin', AdminService.name, 'getAdminByEmail');
    }
    return admin;
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email })
      .andWhere('admin.status != :deletedStatus', { deletedStatus: AdminStatus.DELETED })
      .getOne();
  }

  async findAdminsByEmail(email: string): Promise<Admin[]> {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email })
      .andWhere('admin.status != :deletedStatus', { deletedStatus: AdminStatus.DELETED })
      .getMany();
  }

  async findAdminByEmailAndRole(email: string, role: AdminRole): Promise<Admin | null> {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email AND admin.role = :role', { email, role })
      .andWhere('admin.status != :deletedStatus', { deletedStatus: AdminStatus.DELETED })
      .getOne();
  }

  async getAdmins(country?: string): Promise<AdminDto[]> {
    const whereClause: any = country ? { country: country, status: Not(AdminStatus.DELETED) } : { status: Not(AdminStatus.DELETED) };

    const admins = await this.adminRepository.find({
      where: whereClause
    });
    return plainToInstance(AdminDto, admins, { excludeExtraneousValues: true });
  }

  async updateAdminById(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id, status: Not(AdminStatus.DELETED) } });

    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`);
    }

    if (dto.email && dto.email !== admin.email) {
      const existingAdminByEmail = await this.adminRepository.findOne({
        where: { email: dto.email, status: Not(AdminStatus.DELETED) },
      });
      if (existingAdminByEmail) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`);
      }
    }

    if (dto.phone && dto.phone !== admin.phone) {
      const existingAdminByPhone = await this.adminRepository.findOne({
        where: { phone: dto.phone, status: Not(AdminStatus.DELETED) },
      });
      if (existingAdminByPhone) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`);
      }
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
    dto: { firstName?: string; lastName?: string; photo?: string; password?: string; email?: string; phone?: string; country?: string }
  ): Promise<Admin> {

    const admin = await this.adminRepository.findOne({ where: { id, status: Not(AdminStatus.DELETED) } });

    if (!admin) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Admin with id ${id} not found`);
    }

    if (dto.email && dto.email !== admin.email) {
      const existingAdminByEmail = await this.adminRepository.findOne({
        where: { email: dto.email, status: Not(AdminStatus.DELETED) },
      });
      if (existingAdminByEmail) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with email id ${dto.email} already exists.`);
      }
    }

    if (dto.phone && dto.phone !== admin.phone) {
      const existingAdminByPhone = await this.adminRepository.findOne({
        where: { phone: dto.phone, status: Not(AdminStatus.DELETED) },
      });
      if (existingAdminByPhone) {
        throw new BusinessException(ErrorCodes.ERR_RC_002, `User with phone number ${dto.phone} already exists.`);
      }
    }

    if (dto.firstName !== undefined) admin.firstName = dto.firstName;
    if (dto.lastName !== undefined) admin.lastName = dto.lastName;
    if (dto.photo !== undefined) admin.photo = dto.photo;
    if (dto.email !== undefined) admin.email = dto.email;
    if (dto.phone !== undefined) admin.phone = dto.phone;
    if (dto.country !== undefined) admin.country = dto.country;

    if (dto.password && dto.password.trim() !== '') {
      admin.password = await bcrypt.hash(dto.password, 10);
    }

    return this.adminRepository.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id, status: Not(AdminStatus.DELETED) } });

    if (!admin) throw new NotFoundException('This Admin user not found');

    admin.status = AdminStatus.DELETED;
    await this.adminRepository.save(admin);

    return {
      success: true,
      message: 'Admin user deleted successfully',
    };
  }
}

