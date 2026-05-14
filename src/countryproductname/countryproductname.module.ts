import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countryproductname } from './entities/countryproductname.entity';
import { CountryproductnameService } from './countryproductname.service';
import { CountryproductnameController } from './countryproductname.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Countryproductname])],
    providers: [CountryproductnameService],
    controllers: [CountryproductnameController],
    exports: [CountryproductnameService],
})
export class CountryproductnameModule { }