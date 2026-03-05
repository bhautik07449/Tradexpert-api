import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificationslider } from './entities/certificationslider.entity';
import { CertificationsliderService } from './certificationslider.service';
import { CertificationsliderController } from './certificationslider.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Certificationslider])],
    providers: [CertificationsliderService],
    controllers: [CertificationsliderController],
})
export class CertificationsliderModule { }