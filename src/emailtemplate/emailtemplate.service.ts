import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailTemplate } from "./entities/emailtemplate.entity";
import { Repository } from "typeorm";

@Injectable()
export class EmailTemplateService {
    constructor(
        @InjectRepository(EmailTemplate)
        private readonly emailtemplateRepository: Repository<EmailTemplate>
    ) { }

    async create(data: Partial<EmailTemplate>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const emailtemplate = this.emailtemplateRepository.create(data);
            const saved = await this.emailtemplateRepository.save(emailtemplate);

            return {
                success: true,
                message: 'Email Template created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create email template');
        }
    }

    async findAll() {
        try {
            const data = await this.emailtemplateRepository.find({
                order: { createdAt: 'ASC' },
            });

            return {
                success: true,
                message: 'Email Template fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Email Template');
        }
    }

    async findOne(id: number) {
        try {
            const emailtemplate = await this.emailtemplateRepository.findOne({
                where: { id },
            });

            if (!emailtemplate) {
                throw new NotFoundException('Email Template not found');
            }

            return {
                success: true,
                message: 'Email Template fetched successfully',
                data: emailtemplate,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<EmailTemplate>) {
        try {
            const emailtemplate = await this.emailtemplateRepository.findOne({
                where: { id },
            });

            if (!emailtemplate) {
                throw new NotFoundException('Email Template not found');
            }

            Object.assign(emailtemplate, data);

            const updated = await this.emailtemplateRepository.save(emailtemplate);

            return {
                success: true,
                message: 'Email Template updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const emailtemplate = await this.emailtemplateRepository.findOne({
                where: { id },
            });

            if (!emailtemplate) {
                throw new NotFoundException('Email Template not found');
            }

            await this.emailtemplateRepository.remove(emailtemplate);

            return {
                success: true,
                message: 'Email Template deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}