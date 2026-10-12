import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Inquiry, status } from "./entities/inquiry.entity";
import { Product } from "src/product/entities/product.entity";
import { Buyer } from "src/buyers/entities/buyer.entity";
import { InterwatchAlertService } from "src/interwatch-alert/interwatch-alert.service";

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private readonly inquiryRepository: Repository<Inquiry>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Buyer)
        private readonly buyerRepository: Repository<Buyer>,

        private readonly interwatchAlertService: InterwatchAlertService,
    ) { }

    async create(data: any) {
        try {
            if (!data) {
                throw new BadRequestException("Request body is required");
            }

            let product = null;
            if (data.product) {
                product = await this.productRepository.findOne({
                    where: { id: data.product },
                });

                if (!product) {
                    throw new NotFoundException("Product not found");
                }
            }

            let buyer = null;
            if (data.buyer) {
                buyer = await this.buyerRepository.findOne({
                    where: { id: data.buyer },
                });

                if (!buyer) {
                    throw new NotFoundException("Buyer not found");
                }
            }

            const inquiry = this.inquiryRepository.create({
                subject: data.subject,
                message: data.message,

                quantity: data.expectedQty || data.quantity,
                frequency: data.requirementFrequency || data.frequency,
                price: data.getLatestPrice ? null : (data.preferredPrice || data.price),
                country: data.country,

                reason_type: data.reason_type,
                category: data.category,
                reason_desc: data.reason_desc,
                supplier_id: data.supplier_id || product?.supplier_id,
                supplier_name: data.supplier_name || product?.supplier_name,

                product: product,
                buyer: buyer,
            });

            const saved = await this.inquiryRepository.save(inquiry);

            if (saved.reason_type || saved.reason_desc) {
                try {
                    await this.interwatchAlertService.create({
                        supplier_id: saved.supplier_id || product?.supplier_id,
                        supplier_name: saved.supplier_name || product?.supplier_name || 'Supplier',
                        alert_type: saved.reason_type || 'Fall Short',
                        reason_type: saved.reason_type || 'Fall Short',
                        category: saved.category || 'Material',
                        reason_desc: saved.reason_desc || saved.message,
                        source_module: 'Product Enquiry',
                        source_id: saved.id,
                    });
                } catch (err) {
                    console.error('Failed to auto-create Interwatch Alert for Product Enquiry:', err);
                }
            }

            return {
                success: true,
                message: "Inquiry created successfully",
                data: saved,
            };
        } catch (error) {
            console.error("ERROR:", error);
            throw new InternalServerErrorException(
                error.message || "Failed to create Inquiry"
            );
        }
    }

    async findAll(country?: string, supplier_id?: number) {
        try {
            const whereClause: any = { status: Not(status.DELETED) };
            if (country) {
                whereClause.country = country;
            }
            if (supplier_id) {
                whereClause.supplier_id = supplier_id;
            }
            const data = await this.inquiryRepository.find({
                where: whereClause,
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
                where: { id, status: Not(status.DELETED) },
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
                where: { id, status: Not(status.DELETED) },
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
                where: { id, status: Not(status.DELETED) },
            });

            if (!inquiry) {
                throw new NotFoundException("Inquiry not found");
            }

            inquiry.status = status.DELETED;
            await this.inquiryRepository.save(inquiry);

            return {
                success: true,
                message: "Inquiry deleted successfully",
            };
        } catch (error) {
            throw error;
        }
    }
}