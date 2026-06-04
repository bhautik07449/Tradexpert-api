import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { IRProjectController } from './IRProject.controller';
import { IRProject } from './entities/IRProject.entity';
import { IRProjectService } from './IRProject.service';

@Module({
    imports: [TypeOrmModule.forFeature([IRProject, Category])],
    controllers: [IRProjectController],
    providers: [IRProjectService],
})
export class IRProjectModule { }