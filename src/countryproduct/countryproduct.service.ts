import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countryproduct } from './entities/countryproduct.entity';

import { Countryproductname } from 'src/countryproductname/entities/countryproductname.entity';

@Injectable()
export class CountryproductService {
    constructor(
        @InjectRepository(Countryproduct)
        private readonly countryproductRepo: Repository<Countryproduct>,
        @InjectRepository(Countryproductname)
        private readonly countryproductnameRepo: Repository<Countryproductname>,
    ) { }

    async create(data: any) {
        if (data.categoryId) data.category = { id: data.categoryId };
        if (data.subCategoryId) data.subcategory = { id: data.subCategoryId };
        if (data.productname) data.productname = { id: data.productname };
        if (data.countryproductnameId) data.productname = { id: data.countryproductnameId };

        if (data.product) {
            data.products = [{ id: data.product }];
        } else if (data.productId) {
            data.products = [{ id: data.productId }];
        } else if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(id => typeof id === 'object' ? id : { id });
        }

        const countryproduct = this.countryproductRepo.create(data);
        const saved: any = await this.countryproductRepo.save(countryproduct);
        const savedId = Array.isArray(saved) ? saved[0].id : saved.id;

        const fullData = await this.countryproductRepo.findOne({
            where: { id: savedId },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'productname'],
        });

        return {
            success: true,
            message: 'Product entry created successfully',
            data: fullData,
        };
    }

    async findAll(country?: string) {
        const whereClause = country ? { country: country } : {};

        const data = await this.countryproductRepo.find({
            where: whereClause,
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'productname'],
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            message: 'Product entries fetched successfully',
            data: data,
        };
    }


    async groupedData(country: any) {
        const query = this.countryproductRepo.createQueryBuilder('countryproduct')
            .leftJoinAndSelect('countryproduct.category', 'category')
            .leftJoinAndSelect('countryproduct.subcategory', 'subcategory')
            .leftJoinAndSelect('countryproduct.products', 'products')
            .leftJoinAndSelect('products.offer_type', 'offer_type')
            .leftJoinAndSelect('offer_type.items', 'items')
            .leftJoinAndSelect('items.product', 'item_product')
            .leftJoinAndSelect('countryproduct.productname', 'productname')
            .orderBy('countryproduct.createdAt', 'DESC');

        const typeQuery = this.countryproductnameRepo.createQueryBuilder('countryproductname').orderBy('countryproductname.createdAt', 'DESC');

        if (country) {
            query.where('countryproduct.country = :country', { country });
            typeQuery.where('countryproductname.country = :country', { country });
        }

        const [data, productnames] = await Promise.all([
            query.getMany(),
            typeQuery.getMany()
        ]);

        const grouped = {};
        
        productnames.forEach(type => {
            grouped[type.id] = {
                productname: type,
                itemsMap: {}
            };
        });

        data.forEach(curr => {
            const typeId = curr.productname?.id;

            if (!typeId) {
                if (!grouped['other']) {
                    grouped['other'] = {
                        productname: { id: null, name: 'Other' },
                        itemsMap: {}
                    };
                }
            } else if (!grouped[typeId]) {
                grouped[typeId] = {
                    productname: curr.productname,
                    itemsMap: {}
                };
            }

            const targetGroup = typeId ? grouped[typeId] : grouped['other'];

            const hasCategory = !!curr.category;
            const hasSubCategory = !!curr.subcategory;
            const hasProducts = curr.products && Array.isArray(curr.products) && curr.products.length > 0;

            if (!hasCategory && !hasSubCategory && !hasProducts) {
                return;
            }

            const catId = curr.category?.id || 'none';
            const subCatId = curr.subcategory?.id || 'none';
            const itemKey = `${catId}-${subCatId}`;

            if (!targetGroup.itemsMap[itemKey]) {
                targetGroup.itemsMap[itemKey] = {
                    category: curr.category,
                    sub_category: curr.subcategory,
                    product_data: []
                };
            }

            if (curr.products && Array.isArray(curr.products)) {
                curr.products.forEach(newProd => {
                    const alreadyAdded = targetGroup.itemsMap[itemKey].product_data.some(p => p.id === newProd.id);
                    if (!alreadyAdded) {
                        targetGroup.itemsMap[itemKey].product_data.push(newProd);
                    }
                });
            }
        });

        const result = Object.values(grouped).map((group: any) => ({
            productname: group.productname,
            item: Object.values(group.itemsMap)
        }));

        return {
            success: true,
            message: 'Product entries fetched successfully',
            data: result,
        };
    }

    async findOne(id: number) {
        const data = await this.countryproductRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'productname'],
        });

        if (!data) throw new NotFoundException('Product entry not found');

        return {
            success: true,
            message: 'Product entry fetched successfully',
            data,
        };
    }

    async update(id: number, body: any) {
        const countryproduct = await this.countryproductRepo.findOne({
            where: { id },
        });

        if (!countryproduct)
            throw new NotFoundException('Product entry not found');

        if (body.categoryId) body.category = { id: body.categoryId };
        if (body.subCategoryId) body.subcategory = { id: body.subCategoryId };
        if (body.productname) body.productname = { id: body.productname };
        if (body.countryproductnameId) body.productname = { id: body.countryproductnameId };

        if (body.product) {
            body.products = [{ id: body.product }];
        } else if (body.productId) {
            body.products = [{ id: body.productId }];
        } else if (body.products && Array.isArray(body.products)) {
            body.products = body.products.map(id => typeof id === 'object' ? id : { id });
        }

        Object.assign(countryproduct, body);
        await this.countryproductRepo.save(countryproduct);

        const updated = await this.countryproductRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'productname'],
        });

        return {
            success: true,
            message: 'Product entry updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const countryproduct = await this.countryproductRepo.findOne({
            where: { id },
        });

        if (!countryproduct)
            throw new NotFoundException('Product entry not found');

        await this.countryproductRepo.remove(countryproduct);

        return {
            success: true,
            message: 'Product entry deleted successfully',
        };
    }
}
