import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor } from './entities/investor.entity';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investor]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_TOKEN_EXPIRY') || '1d') as any,
          issuer: configService.get<string>('JWT_ISSUER_NAME') || 'tradexpert',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService],
  exports: [InvestorsService],
})
export class InvestorsModule {}
