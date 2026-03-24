import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditAccountService } from './creditaccount.service';
import { CreditAccountController } from './creditaccount.controller';
import { CreditAccount } from './entity/creditaccount.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CreditAccount])
    ],
    controllers: [CreditAccountController],
    providers: [CreditAccountService],
})
export class CreditAccountModule { }