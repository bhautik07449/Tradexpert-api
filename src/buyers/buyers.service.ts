import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Buyer, BuyerStatus } from './entities/buyer.entity';
import { RegisterBuyerDto } from './dto/register-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { LoginBuyerDto } from './dto/login-buyer.dto';
import { LoginBuyerResultDto } from './dto/login-buyer-result.dto';
import { BusinessException } from 'src/common/business.exception';
import { ErrorCodes } from 'src/common/error-codes.constant';
import { plainToInstance, plainToClass } from 'class-transformer';
import { BuyerDto } from './dto/buyer.dto';
import { EmailService } from 'src/common/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class BuyersService {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) { }

  async createBuyer(dto: RegisterBuyerDto, photoPath?: string): Promise<Buyer> {
    const existingBuyer = await this.buyerRepository.findOne({
      where: { email: dto.email },
    });
    if (existingBuyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_002, `Buyer with email id ${dto.email} already exists.`, 'Buyers', BuyersService.name);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const activationCode = this.generateActivationCode(dto.email);
    const activationDate = new Date('1970-01-01 00:00:01');

    const buyer = this.buyerRepository.create({
      ...dto,
      password: hashedPassword,
      status: BuyerStatus.ACTIVE,
      activationCode,
      activationDate,
    });

    const savedBuyer = await this.buyerRepository.save(buyer);

    // Send activation email (placeholder implementation)
    try {
      await this.emailService.sendActivationEmail({
        email: savedBuyer.email,
        firstName: savedBuyer.firstName,
        lastName: savedBuyer.lastName,
        activationCode: savedBuyer.activationCode,
        // TODO: Get base URL from config service
        // activationUrl: `${baseUrl}/buyers/verify/${savedBuyer.activationCode}`,
      });
    } catch (error) {
      // Log error but don't fail the registration if email fails
      // In production, you might want to queue this for retry
      console.error('Failed to send activation email:', error);
    }

    return savedBuyer;
  }

  async getBuyerById(id: number): Promise<BuyerDto> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Buyer with id ${id} not found`, 'Buyers', BuyersService.name, 'getBuyerById');
    }

    if (buyer.status === 'deleted') {
      throw new BusinessException(
        ErrorCodes.ERR_RC_002,
        `Buyer with id ${id} is deleted`,
        'Buyers',
        BuyersService.name,
        'getBuyerById'
      );
    }
    return plainToInstance(BuyerDto, buyer, { excludeExtraneousValues: true });
  }

  async getBuyerByEmail(email: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({ where: { email } });
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Buyer with email id ${email} not found.`, 'Buyers', BuyersService.name, 'getBuyerByEmail');
    }
    return buyer;
  }

  async getBuyerByEmailOrNull(email: string): Promise<Buyer | null> {
    return this.buyerRepository.findOne({ where: { email } });
  }

  async login(loginBuyerDto: LoginBuyerDto): Promise<any> {
    const buyer = await this.getBuyerByEmailOrNull(loginBuyerDto.email);
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_AC_001, 'Invalid credentials', 'Buyers', BuyersService.name, 'login');
    }
    if (buyer.status === BuyerStatus.BLOCK) {
      throw new BusinessException(ErrorCodes.ERR_AC_002, 'Your account has been blocked.', 'Buyers', BuyersService.name, 'login');
    }
    if (buyer.status === BuyerStatus.PENDING) {
      throw new BusinessException(ErrorCodes.ERR_RC_003, 'Your account is pending activation. Please verify your email.', 'Buyers', BuyersService.name, 'login');
    }
    const isPasswordMatching = await bcrypt.compare(
      loginBuyerDto.password,
      buyer.password,
    );
    if (!isPasswordMatching) {
      throw new BusinessException(ErrorCodes.ERR_AC_001, 'Invalid credentials', 'Buyers', BuyersService.name, 'login');
    }
    const payload = { email: buyer.email, sub: buyer.id, role: 'buyer' };
    const accessToken = this.jwtService.sign(payload);
    const result = plainToClass(LoginBuyerResultDto, buyer, {
      excludeExtraneousValues: true,
    });
    result.access_token = accessToken;
    return {
      success: true,
      message: "Buyer login successfully",
      data: result,
    };
  }

  async getBuyerIdByEmail(email: string): Promise<number | null> {
    const buyer = await this.buyerRepository.findOne({
      where: { email },
      select: ['id'],
    });
    return buyer ? buyer.id : null;
  }

  async getBuyers(): Promise<BuyerDto[]> {
    const buyers = await this.buyerRepository.find({
      where: { status: Not(BuyerStatus.DELETED) },
    });
    return plainToInstance(BuyerDto, buyers, { excludeExtraneousValues: true });
  }

  async updateBuyerById(id: number, dto: UpdateBuyerDto): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Buyer with id ${id} not found`, 'Buyers', BuyersService.name, 'updateBuyerById');
    }
    Object.assign(buyer, dto);
    return this.buyerRepository.save(buyer);
  }

  async verifyBuyer(activationCode: string): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({
      where: { activationCode },
    });

    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, 'Invalid or expired activation code.', 'Buyers', BuyersService.name, 'verifyBuyer');
    }

    buyer.status = BuyerStatus.ACTIVE;
    buyer.activationCode = '';
    buyer.activationDate = new Date();

    return this.buyerRepository.save(buyer);
  }

  async deleteBuyer(id: number): Promise<void> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Buyer with id ${id} not found`, 'Buyers', BuyersService.name, 'deleteBuyer');
    }
    buyer.status = BuyerStatus.DELETED;
    await this.buyerRepository.save(buyer);
  }

  async changeBuyerStatus(id: number, status: BuyerStatus): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) {
      throw new BusinessException(ErrorCodes.ERR_RC_001, `Buyer with id ${id} not found`, 'Buyers', BuyersService.name, 'changeBuyerStatus');
    }
    buyer.status = status;
    return this.buyerRepository.save(buyer);
  }

  private generateActivationCode(email: string): string {
    const timestamp = Date.now().toString();
    const hash = crypto.createHash('md5').update(email + timestamp).digest('hex');
    return hash.substring(0, 32);
  }
}

