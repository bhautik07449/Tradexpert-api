import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Contact, status } from "./entities/contact.entity";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>
    ) { }

    async create(data: Partial<Contact>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const contact = this.contactRepository.create(data);
            const saved = await this.contactRepository.save(contact);

            return {
                success: true,
                message: 'Contact created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Contact');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = country ? { country, status: Not(status.DELETED) } : { status: Not(status.DELETED) };
            const data = await this.contactRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Contact fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Contact');
        }
    }

    async findOne(id: number) {
        try {
            const contact = await this.contactRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!contact) {
                throw new NotFoundException('Contact not found');
            }

            return {
                success: true,
                message: 'Contact fetched successfully',
                data: contact,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Contact>) {
        try {
            const contact = await this.contactRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!contact) {
                throw new NotFoundException('Contact not found');
            }

            Object.assign(contact, data);

            const updated = await this.contactRepository.save(contact);

            return {
                success: true,
                message: 'Contact updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const contact = await this.contactRepository.findOne({
                where: { id, status: Not(status.DELETED) },
            });

            if (!contact) {
                throw new NotFoundException('Contact not found');
            }

            contact.status = status.DELETED;
            await this.contactRepository.save(contact);

            return {
                success: true,
                message: 'Contact deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}