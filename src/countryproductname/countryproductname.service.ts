import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Countryproductname, Status } from "./entities/countryproductname.entity";

@Injectable()
export class CountryproductnameService {
    constructor(
        @InjectRepository(Countryproductname)
        private readonly countryproductnameRepository: Repository<Countryproductname>
    ) { }

    async create(data: Partial<Countryproductname>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }
            const countryproductname = this.countryproductnameRepository.create(data);
            const saved = await this.countryproductnameRepository.save(countryproductname);

            return {
                success: true,
                message: 'Country Product Name created successfully',
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create Country Product Name');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = country ? { country: country, status: Not(Status.DELETED) } : { status: Not(Status.DELETED) };

            const data = await this.countryproductnameRepository.find({
                order: { createdAt: 'DESC' },
                where: whereClause
            });

            return {
                success: true,
                message: 'Country Product Name fetched successfully',
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Country Product Name');
        }
    }

    async findOne(id: number) {
        try {
            const countryproductname = await this.countryproductnameRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!countryproductname) {
                throw new NotFoundException('Country Product Name not found');
            }

            return {
                success: true,
                message: 'Country Product Name fetched successfully',
                data: countryproductname,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Countryproductname>) {
        try {
            const countryproductname = await this.countryproductnameRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!countryproductname) {
                throw new NotFoundException('Country Product Name not found');
            }

            Object.assign(countryproductname, data);

            const updated = await this.countryproductnameRepository.save(countryproductname);

            return {
                success: true,
                message: 'Country Product Name updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const countryproductname = await this.countryproductnameRepository.findOne({
                where: { id, status: Not(Status.DELETED) },
            });

            if (!countryproductname) {
                throw new NotFoundException('Country Product Name not found');
            }

            countryproductname.status = Status.DELETED;
            await this.countryproductnameRepository.save(countryproductname);

            return {
                success: true,
                message: 'Country Product Name deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

}