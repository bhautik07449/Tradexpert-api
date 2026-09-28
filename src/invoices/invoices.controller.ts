import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { AdminOrSupplierAuthGuard } from 'src/auth/admin-or-supplier-auth.guard';

@Controller('invoices')
@UseGuards(AdminOrSupplierAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() body: Partial<Invoice>, @Request() req: any): Promise<Invoice> {
    return this.invoicesService.create(body, req?.user);
  }

  @Get()
  findAll(@Request() req: any): Promise<Invoice[]> {
    return this.invoicesService.findAll(req?.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    return this.invoicesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.invoicesService.remove(id);
  }
}