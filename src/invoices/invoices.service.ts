import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async create(data: Partial<Invoice>, user: any): Promise<Invoice> {
    if (user && user.role === 'supplier') {
      data.supplier_id = user.sub;
    }
    const invoice = this.invoiceRepository.create(data);
    return await this.invoiceRepository.save(invoice);
  }

  async findAll(user: any): Promise<Invoice[]> {
    const whereClause: any = {};
    if (user && user.role === 'supplier') {
      whereClause.supplier_id = user.sub;
    }
    return await this.invoiceRepository.find({
      where: whereClause,
      relations: ['supplier'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    return invoice;
  }

  async remove(id: number): Promise<{ message: string }> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
    return { message: 'Invoice deleted successfully' };
  }
}