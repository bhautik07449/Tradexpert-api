import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inquiry } from "./entities/inquiry.entity";
import { Product } from "src/product/entities/product.entity";

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private readonly inquiryRepository: Repository<Inquiry>,

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

            const requestSample = this.inquiryRepository.create({
                email: data.email,
                quantity: data.quantity,
                product: product,
            });

            const saved = await this.inquiryRepository.save(requestSample);

            return {
                success: true,
                message: "Inquiry created successfully",
                data: saved,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Failed to create Inquiry"
            );
        }
    }

    async findAll() {
        try {
            const data = await this.inquiryRepository.find({
                relations: ["product"],
                order: { createdAt: "DESC" },
            });

            return {
                success: true,
                message: "Inquiry fetched successfully",
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Failed to fetch Inquiry"
            );
        }
    }

    async findOne(id: number) {
        try {
            const inquiry = await this.inquiryRepository.findOne({
                where: { id },
                relations: ["product"],
            });

            if (!inquiry) {
                throw new NotFoundException("Inquiry not found");
            }

            return {
                success: true,
                message: "Inquiry fetched successfully",
                data: inquiry,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            const inquiry = await this.inquiryRepository.findOne({
                where: { id },
            });

            if (!inquiry) {
                throw new NotFoundException("Inquiry not found");
            }

            if (data.product) {
                const product = await this.productRepository.findOne({
                    where: { id: data.product },
                });

                if (!product) {
                    throw new NotFoundException("Product not found");
                }

                inquiry.product = product;
            }

            Object.assign(inquiry, data);

            const updated = await this.inquiryRepository.save(inquiry);

            return {
                success: true,
                message: "Inquiry updated successfully",
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const inquiry = await this.inquiryRepository.findOne({
                where: { id },
            });

            if (!inquiry) {
                throw new NotFoundException("Inquiry not found");
            }

            await this.inquiryRepository.remove(inquiry);

            return {
                success: true,
                message: "Inquiry deleted successfully",
            };
        } catch (error) {
            throw error;
        }
    }
}