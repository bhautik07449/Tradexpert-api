import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { Inquiry } from "src/inquiry/entities/inquiry.entity";
import { Product } from "src/product/entities/product.entity";
import { Quotation } from "src/quotation/entities/quotation.entity";
import { Requestsamples } from "src/requestsamples/entities/requestsamples.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Requestsamples)
        private readonly sampleRepo: Repository<Requestsamples>,

        @InjectRepository(Quotation)
        private readonly quotationRepo: Repository<Quotation>,

        @InjectRepository(Inquiry)
        private readonly enquiryRepo: Repository<Inquiry>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }
    async getDashboardData() {
        const totalCategory = await this.categoryRepo.count();
        const totalRequest = await this.sampleRepo.count();
        const totalQuotation = await this.quotationRepo.count();
        const totalEnquiry = await this.enquiryRepo.count();

        const monthlyRaw = await this.productRepo
            .createQueryBuilder('product')
            .select('MONTH(product.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .getRawMany();

        const monthlyProducts = Array(12).fill(0);
        monthlyRaw.forEach(item => {
            monthlyProducts[item.month - 1] = parseInt(item.count);
        });

        const growthRaw = await this.sampleRepo
            .createQueryBuilder('sample')
            .select('MONTH(sample.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const sampleRequestGrowth = growthRaw.map(item => Number(item.count));

        return {
            totalCategory,
            totalRequest,
            totalQuotation,
            totalEnquiry,
            monthlyProducts,
            sampleRequestGrowth,
        };
    }
}