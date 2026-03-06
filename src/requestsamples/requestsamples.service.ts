import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Requestsamples } from "./entities/requestsamples.entity";
import { Product } from "src/products/entities/product.entity";

@Injectable()
export class RequestsamplesService {
    constructor(
        @InjectRepository(Requestsamples)
        private readonly requestSampleRepository: Repository<Requestsamples>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    async create(data: any) {
        try {
            if (!data) {
                throw new BadRequestException("Request body is required");
            }

            const product = await this.productRepository.findOne({
                where: { id: data.product },
            });

            if (!product) {
                throw new NotFoundException("Product not found");
            }

            const requestSample = this.requestSampleRepository.create({
                email: data.email,
                quantity: data.quantity,
                product: product,
            });

            const saved = await this.requestSampleRepository.save(requestSample);

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

    async findAll() {
        try {
            const data = await this.requestSampleRepository.find({
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

                requestSample.product = product;
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