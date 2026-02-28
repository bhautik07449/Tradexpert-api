import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BuyersService } from './buyers.service';
import { RegisterBuyerDto } from './dto/register-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { LoginBuyerDto } from './dto/login-buyer.dto';
import { BuyerAuthGuard } from 'src/auth/buyer-auth.guard';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { BuyerDto } from './dto/buyer.dto';
import { LoginBuyerResultDto } from './dto/login-buyer-result.dto';
import { Transactional } from 'typeorm-transactional';
import { BuyerStatus } from './entities/buyer.entity';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) { }

  @Post('signup')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  @Transactional()
  async signup(@UploadedFile() file: Express.Multer.File, @Body() registerBuyerDto: RegisterBuyerDto) {
    return await this.buyersService.createBuyer(registerBuyerDto, file ? file.path : '');
  }

  @Post('login')
  @Transactional()
  async login(@Body() loginBuyerDto: LoginBuyerDto): Promise<LoginBuyerResultDto> {
    return await this.buyersService.login(loginBuyerDto);
  }

  @Get('verify/:activationCode')
  @Transactional()
  async verify(@Param('activationCode') activationCode: string) {
    return await this.buyersService.verifyBuyer(activationCode);
  }

  @Get('dashboard')
  @UseGuards(BuyerAuthGuard)
  @Transactional()
  async dashboard() {
    // Dashboard endpoint - can be extended later
    return { message: 'Buyer dashboard' };
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(AdminAuthGuard)
  @Transactional()
  async findAll(@Query('all') all?: string): Promise<BuyerDto[]> {
    return await this.buyersService.getBuyers();
  }

  @Get('admin/:buyerId')
  @UseGuards(AdminAuthGuard)
  @Transactional()
  async getBuyerById(@Param('buyerId') buyerId: string): Promise<BuyerDto> {
    const id = Number(buyerId);
    return await this.buyersService.getBuyerById(id);
  }

  @Patch('admin/:buyerId')
  @UseGuards(AdminAuthGuard)
  @Transactional()
  async updateBuyer(@Param('buyerId') buyerId: string, @Body() updateBuyerDto: UpdateBuyerDto): Promise<BuyerDto> {
    const id = Number(buyerId);
    await this.buyersService.updateBuyerById(id, updateBuyerDto);
    return await this.buyersService.getBuyerById(id);
  }

  @Delete('admin/:buyerId')
  @UseGuards(AdminAuthGuard)
  @Transactional()
  async deleteBuyer(@Param('buyerId') buyerId: string): Promise<{ message: string }> {
    const id = Number(buyerId);
    await this.buyersService.deleteBuyer(id);
    return { message: 'Buyer has been deleted successfully.' };
  }

  @Patch('admin/:buyerId/status')
  @UseGuards(AdminAuthGuard)
  @Transactional()
  async changeStatus(
    @Param('buyerId') buyerId: string,
    @Body('status') status: BuyerStatus,
  ): Promise<{ message: string }> {
    const id = Number(buyerId);
    await this.buyersService.changeBuyerStatus(id, status);
    return { message: `Buyer status has been successfully changed to ${status}` };
  }
}

