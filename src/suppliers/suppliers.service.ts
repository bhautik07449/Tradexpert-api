import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, Not } from 'typeorm';
import { Supplier, SupplierStatus } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async create(data: Partial<Supplier>): Promise<Supplier> {
    if (data.email) {
      const existingSupplier = await this.supplierRepository.findOne({ where: { email: data.email } });
      if (existingSupplier) {
        throw new ConflictException('Email already exists');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const supplier = this.supplierRepository.create(data);
    return await this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find({
      where: { status: SupplierStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
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
        where: { email: data.email, id: Not(id) } 
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
    const supplier = await this.supplierRepository.findOne({ where: { email } });

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

    const { password: _, ...result } = supplier;
    return {
      message: 'Supplier Login successful',
      supplier: result,
    };
  }

  async forgotPassword(data: any): Promise<{ message: string }> {
    const { email, newPassword } = data;
    
    if (!email || !newPassword) {
      throw new ConflictException('Email and new password are required');
    }

    const supplier = await this.supplierRepository.findOne({ where: { email } });

    if (!supplier) {
      throw new NotFoundException(`Supplier with email ${email} not found`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    supplier.password = hashedPassword;
    
    await this.supplierRepository.save(supplier);

    return { message: 'Password updated successfully' };
  }
}