import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditAccount } from './entity/creditaccount.entity';

@Injectable()
export class CreditAccountService {
    constructor(
        @InjectRepository(CreditAccount)
        private readonly creditAccountRepo: Repository<CreditAccount>,
    ) { }

    async create(data: CreditAccount) {
        try {
            const account = this.creditAccountRepo.create(data);
            await this.creditAccountRepo.save(account);
            return { message: 'Credit account created successfully', account };
        } catch (error) {
            throw new Error(`Failed to create credit account: ${error.message}`);
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const accounts = await this.creditAccountRepo.find({
                where: whereClause
            });
            return { message: 'Credit accounts retrieved successfully', accounts };
        } catch (error) {
            throw new Error(`Failed to retrieve credit accounts: ${error.message}`);
        }
    }

    async findOne(id: string) {
        try {
            const account = await this.creditAccountRepo.findOne({ where: { id } });

            if (!account) {
                throw new NotFoundException(`Credit account with ID ${id} not found`);
            }

            return account;
        } catch (error) {
            throw new Error(`Failed to retrieve credit account: ${error.message}`);
        }
    }

    async update(id: string, data: Partial<CreditAccount>) {
        try {
            const account = await this.findOne(id);

            Object.assign(account, data);
            const updatedAccount = await this.creditAccountRepo.save(account);
            return { message: 'Credit account updated successfully', updatedAccount };
        } catch (error) {
            throw new Error(`Failed to update credit account: ${error.message}`);
        }
    }

    async remove(id: string) {
        try {
            const account = await this.findOne(id);
            await this.creditAccountRepo.remove(account);
            return { message: 'Credit account deleted successfully', account };
        } catch (error) {
            throw new Error(`Failed to delete credit account: ${error.message}`);
        }
    }
}