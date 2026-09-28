import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/entities/category.entity";
import { Inquiry } from "src/inquiry/entities/inquiry.entity";
import { Product } from "src/product/entities/product.entity";
import { Quotation } from "src/quotation/entities/quotation.entity";
import { Requestsamples } from "src/requestsamples/entities/requestsamples.entity";
import { Blog } from "src/blog/entities/blog.entity";
import { Team } from "src/team/entities/team.entity";
import { Client } from "src/client/entities/client.entity";
import { Events } from "src/events/entities/events.entity";
import { Repository } from "typeorm";

import { Brand } from "src/brands/entities/brand.entity";
import { Tradeoffer } from "src/tradeoffer/entities/tradeoffer.entity";

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

        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>,

        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,

        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,

        @InjectRepository(Events)
        private readonly eventsRepo: Repository<Events>,

        @InjectRepository(Brand)
        private readonly brandRepo: Repository<Brand>,

        @InjectRepository(Tradeoffer)
        private readonly tradeofferRepo: Repository<Tradeoffer>,
    ) { }
    async getDashboardData() {
        const totalCategory = await this.categoryRepo.count();
        const totalRequest = await this.sampleRepo.count();
        const totalQuotation = await this.quotationRepo.count();
        const totalEnquiry = await this.enquiryRepo.count();

        const monthlyRaw = await this.productRepo
            .createQueryBuilder('product')
            .select('EXTRACT(MONTH FROM product.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const monthlyProducts = Array(12).fill(0);
        
        monthlyRaw.forEach(item => {
            monthlyProducts[item.month - 1] = parseInt(item.count);
        });

        const growthRaw = await this.sampleRepo
            .createQueryBuilder('sample')
            .select('EXTRACT(MONTH FROM sample.created_at)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const sampleRequestGrowth = Array(12).fill(0);
        
        growthRaw.forEach(item => {
            sampleRequestGrowth[item.month - 1] = parseInt(item.count);
        });

        return {
            totalCategory,
            totalRequest,
            totalQuotation,
            totalEnquiry,
            monthlyProducts,
            sampleRequestGrowth,
        };
    }

    async getServiceDashboardData() {
        const totalBlogs = await this.blogRepo.count();
        const totalTeamMembers = await this.teamRepo.count();
        const totalClients = await this.clientRepo.count();
        const totalEvents = await this.eventsRepo.count();

        const blogGrowthRaw = await this.blogRepo
            .createQueryBuilder('blog')
            .select('EXTRACT(MONTH FROM blog.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const blogGrowth = monthNames.map((name, idx) => {
            const found = blogGrowthRaw.find(item => parseInt(item.month) === idx + 1);
            return { name, count: found ? parseInt(found.count) : 0 };
        });

        const eventGrowthRaw = await this.eventsRepo
            .createQueryBuilder('event')
            .select('EXTRACT(MONTH FROM event.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const eventGrowth = monthNames.map((name, idx) => {
            const found = eventGrowthRaw.find(item => parseInt(item.month) === idx + 1);
            return { name, count: found ? parseInt(found.count) : 0 };
        });

        return {
            totalBlogs,
            totalTeamMembers,
            totalClients,
            totalEvents,
            blogGrowth,
            eventGrowth,
        };
    }

    async getSupplierDashboardData() {
        const totalProducts = await this.productRepo.count();
        const totalCategories = await this.categoryRepo.count();
        const totalBrands = await this.brandRepo.count();
        const totalTradeOffers = await this.tradeofferRepo.count();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const productGrowthRaw = await this.productRepo
            .createQueryBuilder('product')
            .select('EXTRACT(MONTH FROM product.createdAt)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const productGrowth = monthNames.map((name, idx) => {
            const found = productGrowthRaw.find(item => parseInt(item.month) === idx + 1);
            return { name, products: found ? parseInt(found.count) : 0 };
        });

        // We can leave inquiryGrowth as is for the chart or change it if we want.
        // Let's keep inquiryGrowth so the chart doesn't break, or we can replace it with tradeOfferGrowth.
        // The user didn't mention chart, but we'll leave it as is to avoid breaking.
        const inquiryGrowthRaw = await this.enquiryRepo
            .createQueryBuilder('inquiry')
            .select('EXTRACT(MONTH FROM inquiry.created_at)', 'month')
            .addSelect('COUNT(*)', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const inquiryGrowth = monthNames.map((name, idx) => {
            const found = inquiryGrowthRaw.find(item => parseInt(item.month) === idx + 1);
            return { name, inquiries: found ? parseInt(found.count) : 0 };
        });

        return {
            totalProducts,
            totalCategories,
            totalBrands,
            totalTradeOffers,
            productGrowth,
            inquiryGrowth,
        };
    }
}