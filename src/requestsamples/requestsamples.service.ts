import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Requestsamples } from "./entities/requestsamples.entity";
import { Product } from "src/product/entities/product.entity";
import { Buyer } from "src/buyers/entities/buyer.entity";

@Injectable()
export class RequestsamplesService {
    constructor(
        @InjectRepository(Requestsamples)
        private readonly requestSampleRepository: Repository<Requestsamples>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Buyer)
        private readonly buyerRepository: Repository<Buyer>
    ) { }

    async create(data: any) {
        try {
            if (!data) {
                throw new BadRequestException("Request body is required");
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: data.product },
                });

                if (!product) {
                    throw new NotFoundException("Product not found");
                }

                data.product = product
            }

            if (data.buyer) {
                const buyer = await this.buyerRepository.findOne({
                    where: { id: data.buyer },
                });


                if (!buyer) {
                    throw new NotFoundException("Buyer not found");
                }

                data.buyer = buyer
            }

            const saved = await this.requestSampleRepository.save(data);

            return {
                success: true,
                message: "Request sample created successfully",
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Failed to create request sample"
            );
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = {};
            if (country) {
                whereClause.country = country;
            }
            const data = await this.requestSampleRepository.find({
                where: whereClause,
                relations: ["product"],
                order: { createdAt: "DESC" },
            });

            return {
                success: true,
                message: "Request samples fetched successfully",
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Failed to fetch request samples"
            );
        }
    }

    async findOne(id: number) {
        try {
            const requestSample = await this.requestSampleRepository.findOne({
                where: { id },
                relations: ["product"],
            });

            if (!requestSample) {
                throw new NotFoundException("Request sample not found");
            }

            return {
                success: true,
                message: "Request sample fetched successfully",
                data: requestSample,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            const requestSample = await this.requestSampleRepository.findOne({
                where: { id },
            });

            if (!requestSample) {
                throw new NotFoundException("Request sample not found");
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: data.product },
                });

                if (!product) {
                    throw new NotFoundException("Product not found");
                }

                data.product = product
            }

            if (data.buyer) {
                const buyer = await this.buyerRepository.findOne({
                    where: { id: data.buyer },
                });

                if (!buyer) {
                    throw new NotFoundException("Buyer not found");
                }

                data.buyer = buyer
            }

            Object.assign(requestSample, data);

            const updated = await this.requestSampleRepository.save(requestSample);

            return {
                success: true,
                message: "Request sample updated successfully",
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const requestSample = await this.requestSampleRepository.findOne({
                where: { id },
            });

            if (!requestSample) {
                throw new NotFoundException("Request sample not found");
            }

            await this.requestSampleRepository.remove(requestSample);

            return {
                success: true,
                message: "Request sample deleted successfully",
            };
        } catch (error) {
            throw error;
        }
    }
}