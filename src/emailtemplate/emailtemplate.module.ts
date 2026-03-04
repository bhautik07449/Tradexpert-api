import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateService } from './emailtemplate.service';
import { EmailTemplateController } from './emailtemplate.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EmailtemplateModule])],
    providers: [EmailTemplateService],
    controllers: [EmailTemplateController],
})
export class EmailtemplateModule { }