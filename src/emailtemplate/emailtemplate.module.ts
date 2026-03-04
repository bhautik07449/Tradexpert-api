import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateService } from './emailtemplate.service';
import { EmailTemplateController } from './emailtemplate.controller';
import { EmailTemplate } from './entities/emailtemplate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmailTemplate])],
    providers: [EmailTemplateService],
    controllers: [EmailTemplateController],
})
export class EmailtemplateModule { }