import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { ContactNo } from "./entities/contactByCountry.entity";

@Injectable()
export class ContactNoService {
    constructor(
        @InjectRepository(ContactNo)
        private readonly contactnoRepository: Repository<ContactNo>
    ) { }

    async create(data: Partial<ContactNo>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.country) {
                const existingCountry = await this.contactnoRepository.findOne({ where: { country: data.country } });
                if (existingCountry) {
                    throw new BadRequestException('Contact with this country already exists');
                }
            }
            if (data.phone) {
                const existingPhone = await this.contactnoRepository.findOne({ where: { phone: data.phone } });
                if (existingPhone) {
                    throw new BadRequestException('Contact with this phone already exists');
                }
            }

            const contact = this.contactnoRepository.create(data);
            const saved = await this.contactnoRepository.save(contact);

            return {
                success: true,
                message: 'Contact created successfully',
                data: saved,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create Contact');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause = country ? { country: country } : {}

            const data = await this.contactnoRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
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
            const contact = await this.contactnoRepository.findOne({
                where: { id },
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

    async update(id: number, data: Partial<ContactNo>) {
        try {
            const contact = await this.contactnoRepository.findOne({
                where: { id },
            });

            if (!contact) {
                throw new NotFoundException('Contact not found');
            }

            if (data.country && data.country !== contact.country) {
                const existingCountry = await this.contactnoRepository.findOne({ where: { country: data.country, id: Not(id) } });
                if (existingCountry) {
                    throw new BadRequestException('Contact with this country already exists');
                }
            }
            if (data.phone && data.phone !== contact.phone) {
                const existingPhone = await this.contactnoRepository.findOne({ where: { phone: data.phone, id: Not(id) } });
                if (existingPhone) {
                    throw new BadRequestException('Contact with this phone already exists');
                }
            }

            Object.assign(contact, data);

            const updated = await this.contactnoRepository.save(contact);

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
            const contact = await this.contactnoRepository.findOne({
                where: { id },
            });

            if (!contact) {
                throw new NotFoundException('Contact not found');
            }

            await this.contactnoRepository.remove(contact);

            return {
                success: true,
                message: 'Contact deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }
}