import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, Not } from 'typeorm';
import { Supplier, SupplierStatus } from './entities/supplier.entity';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly jwtService: JwtService,
  ) { }

  async create(data: Partial<Supplier>): Promise<Supplier> {
    if (data.email) {
      const existingSupplier = await this.supplierRepository.findOne({ 
        where: { email: data.email } 
      });
      if (existingSupplier) {
        if (existingSupplier.status !== SupplierStatus.DELETED) {
          throw new ConflictException('Email already exists');
        }

        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }
        Object.assign(existingSupplier, data, { status: SupplierStatus.PENDING });
        return await this.supplierRepository.save(existingSupplier);
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (!data.status) {
      data.status = SupplierStatus.PENDING;
    }
    const supplier = this.supplierRepository.create(data);
    return await this.supplierRepository.save(supplier);
  }

  async findAll(country?: string): Promise<Supplier[]> {
    const whereClause: any = { status: Not(SupplierStatus.DELETED) };
    if (country) {
      whereClause.country = country;
    }
    return await this.supplierRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, status: Not(SupplierStatus.DELETED) },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: number, data: Partial<Supplier>): Promise<Supplier> {
    const supplier = await this.findOne(id);

    if (data.email && data.email !== supplier.email) {
      const existingSupplier = await this.supplierRepository.findOne({ 
        where: { email: data.email, id: Not(id), status: Not(SupplierStatus.DELETED) } 
      });
      if (existingSupplier) {
        throw new ConflictException('Email already in use by another supplier');
      }
    }

    Object.assign(supplier, data);

    return await this.supplierRepository.save(supplier);
  }

  async remove(id: number): Promise<{ message: string }> {
    const supplier = await this.findOne(id);

    supplier.status = SupplierStatus.DELETED;
    await this.supplierRepository.save(supplier);

    return { message: 'Supplier deleted successfully' };
  }

  async login(loginData: any): Promise<any> {
    const { email, password } = loginData;
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .addSelect('supplier.password')
      .where('supplier.email = :email', { email })
      .andWhere('supplier.status != :deletedStatus', { deletedStatus: SupplierStatus.DELETED })
      .getOne();

    if (!supplier) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!supplier.password) {
      throw new UnauthorizedException('Password not set for this supplier');
    }

    const isPasswordMatching = await bcrypt.compare(password, supplier.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (supplier.status === SupplierStatus.PENDING) {
      throw new UnauthorizedException('Your account is pending admin approval. Please contact admin.');
    }

    if (supplier.status === SupplierStatus.BLOCKED || supplier.status === SupplierStatus.REVOKED) {
      throw new UnauthorizedException('Your access to this app has been revoked by admin.');
    }

    await this.supplierRepository.update(supplier.id, { status: SupplierStatus.ACTIVE });
    supplier.status = SupplierStatus.ACTIVE;

    const { password: _, ...result } = supplier;
    return {
      message: 'Supplier Login successful',
      supplier: result,
    };
  }

  async logout(tokenOrId: string | number): Promise<{ success: boolean; message: string }> {
    let supplierId: number | null = null;
    if (typeof tokenOrId === 'number') {
      supplierId = tokenOrId;
    } else if (typeof tokenOrId === 'string') {
      const cleanToken = tokenOrId.replace(/^"|"$/g, '').trim();
      if (!isNaN(Number(cleanToken)) && Number(cleanToken) > 0) {
        supplierId = Number(cleanToken);
      } else {
        try {
          const decoded: any = this.jwtService.decode(cleanToken);
          if (decoded && decoded.sub) {
            supplierId = decoded.sub;
          }
        } catch (error) {
          // Token decode failed
        }
      }
    }
    if (supplierId) {
      await this.supplierRepository.update(supplierId, { status: SupplierStatus.INACTIVE });
    }
    return {
      success: true,
      message: "Supplier logged out successfully",
    };
  }

  async forgotPassword(data: any): Promise<{ message: string }> {
    const { email, newPassword } = data;
    
    if (!email || !newPassword) {
      throw new ConflictException('Email and new password are required');
    }

    const supplier = await this.supplierRepository.findOne({ where: { email, status: Not(SupplierStatus.DELETED) } });

    if (!supplier) {
      throw new NotFoundException(`Supplier with email ${email} not found`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    supplier.password = hashedPassword;
    
    await this.supplierRepository.save(supplier);

    return { message: 'Password updated successfully' };
  }
}