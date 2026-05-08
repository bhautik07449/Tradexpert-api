import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abctype } from './entities/abctype.entity';
import { AbctypeService } from './abctype.service';
import { AbctypeController } from './abctype.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Abctype])],
    providers: [AbctypeService],
    controllers: [AbctypeController],
    exports: [AbctypeService],
})
export class AbctypeModule { }