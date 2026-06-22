import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactNo } from './entities/contactByCountry.entity';
import { ContactNoService } from './contactByCountry.service';
import { ContactNoController } from './contactByCountry.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ContactNo])],
    providers: [ContactNoService],
    controllers: [ContactNoController],
    exports: [ContactNoService],
})
export class ContactNoModule { }