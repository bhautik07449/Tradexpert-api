import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElearningApiKey } from './entities/ElearningApiKey.entity';
import { ElearningApiKeyService } from './ElearningApiKey.service';
import { ElearningApiKeyController } from './ElearningApiKey.controller';


@Module({
    imports: [TypeOrmModule.forFeature([ElearningApiKey])],
    providers: [ElearningApiKeyService],
    controllers: [ElearningApiKeyController],
    exports: [ElearningApiKeyService],
})
export class ElearningApiKeyModule { }