import { Injectable, NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, Not } from 'typeorm';
import { Investor, InvestorStatus } from './entities/investor.entity';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectRepository(Investor)
    private readonly investorRepository: Repository<Investor>,
  ) { }

  async create(data: Partial<Investor>) {
    try {
      if (data.email) {
        const existingInvestor = await this.investorRepository.findOne({ where: { email: data.email } });
        if (existingInvestor) {
          throw new ConflictException('Email already exists');
        }
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      if (!data.status) {
        data.status = InvestorStatus.PENDING;
      }
      const investor = this.investorRepository.create(data);
      const saved = await this.investorRepository.save(investor);

      return {
        success: true,
        message: 'Investor registered successfully. Pending admin approval.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to register investor');
    }
  }

  async findAll(country?: string) {
    try {
      const whereClause: any = { status: Not(InvestorStatus.DELETED) };
      if (country) {
        whereClause.country = country;
      }
      const data = await this.investorRepository.find({
        where: whereClause,
        order: { createdAt: 'DESC' },
      });

      return {
        success: true,
        message: 'Investors fetched successfully',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch investors');
    }
  }

  async findOne(id: number) {
    try {
      const investor = await this.investorRepository.findOne({
        where: { id },
      });

      if (!investor) {
        throw new NotFoundException(`Investor with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Investor fetched successfully',
        data: investor,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: Partial<Investor>) {
    try {
      const investorResult = await this.findOne(id);
      const investor = investorResult.data;

      if (data.email && data.email !== investor.email) {
        const existingInvestor = await this.investorRepository.findOne({
          where: { email: data.email, id: Not(id) },
        });
        if (existingInvestor) {
          throw new ConflictException('Email already in use by another investor');
        }
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      } else {
        delete data.password;
      }

      Object.assign(investor, data);

      const updated = await this.investorRepository.save(investor);

      return {
        success: true,
        message: 'Investor updated successfully',
        data: updated,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const investorResult = await this.findOne(id);
      const investor = investorResult.data;

      investor.status = InvestorStatus.DELETED;
      await this.investorRepository.save(investor);

      return { 
        success: true,
        message: 'Investor deleted successfully' 
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: any) {
    try {
      const { email, password } = loginData;
      const investor = await this.investorRepository
        .createQueryBuilder('investor')
        .addSelect('investor.password')
        .where('investor.email = :email', { email })
        .getOne();

      if (!investor) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!investor.password) {
        throw new UnauthorizedException('Password not set for this investor');
      }

      const isPasswordMatching = await bcrypt.compare(password, investor.password);

      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (investor.status === InvestorStatus.PENDING) {
        throw new UnauthorizedException('Your account is pending admin approval. Please contact admin.');
      }

      if (investor.status === InvestorStatus.BLOCKED || investor.status === InvestorStatus.REVOKED) {
        throw new UnauthorizedException('Your access to this app has been revoked by admin.');
      }

      const { password: _, ...result } = investor;
      return {
        success: true,
        message: 'Investor Login successful',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(data: any) {
    try {
      const { email, newPassword } = data;
      
      if (!email || !newPassword) {
        throw new ConflictException('Email and new password are required');
      }

      const investor = await this.investorRepository.findOne({ where: { email } });

      if (!investor) {
        throw new NotFoundException(`Investor with email ${email} not found`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      investor.password = hashedPassword;
      
      await this.investorRepository.save(investor);

      return { 
        success: true,
        message: 'Password updated successfully' 
      };
    } catch (error) {
      throw error;
    }
  }
}
