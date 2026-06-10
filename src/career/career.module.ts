import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Career]),
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
    providers: [CareerService],
    controllers: [CareerController],
    exports: [CareerService],
})
export class CareerModule { }