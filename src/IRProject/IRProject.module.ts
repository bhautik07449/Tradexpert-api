import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { IRProjectController } from './IRProject.controller';
import { IRProject } from './entities/IRProject.entity';
import { IRProjectService } from './IRProject.service';
import { Financial } from 'src/financialservice/entities/financialservice.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IRProject, Category, Financial])],
    controllers: [IRProjectController],
    providers: [IRProjectService],
})
export class IRProjectModule { }