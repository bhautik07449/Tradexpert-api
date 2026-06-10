import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';
import { Buyer } from './entities/buyer.entity';
import { EmailModule } from 'src/common/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_TOKEN_EXPIRY') as any,
          issuer: configService.get<string>('JWT_ISSUER_NAME'),
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  controllers: [BuyersController],
  providers: [BuyersService],
  exports: [BuyersService],
})
export class BuyersModule {}

