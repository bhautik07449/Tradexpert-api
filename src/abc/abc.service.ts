import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abc } from './entities/abc.entity';

import { Abctype } from 'src/abcType/entities/abctype.entity';

@Injectable()
export class AbcService {
    constructor(
        @InjectRepository(Abc)
        private readonly abcRepo: Repository<Abc>,
        @InjectRepository(Abctype)
        private readonly abctypeRepo: Repository<Abctype>,
    ) { }

    async create(data: any) {
        if (data.categoryId) data.category = { id: data.categoryId };
        if (data.subCategoryId) data.subcategory = { id: data.subCategoryId };
        if (data.abcTypeId) data.abc_type = { id: data.abcTypeId };

        if (data.product) {
            data.products = [{ id: data.product }];
        } else if (data.productId) {
            data.products = [{ id: data.productId }];
        } else if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(id => typeof id === 'object' ? id : { id });
        }

        const abc = this.abcRepo.create(data);
        const saved: any = await this.abcRepo.save(abc);
        const savedId = Array.isArray(saved) ? saved[0].id : saved.id;

        const fullData = await this.abcRepo.findOne({
            where: { id: savedId },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'abc_type'],
        });

        return {
            success: true,
            message: 'ABC entry created successfully',
            data: fullData,
        };
    }

    async findAll(country?: string) {
        const whereClause = country ? { abc_type: { country: country } } : {}

        const data = await this.abcRepo.find({
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'abc_type'],
            order: { createdAt: 'DESC' },
            where: whereClause
        });
        return {
            success: true,
            message: 'ABC entries fetched successfully',
            data: data,
        };
    }


    async groupedData(country?: string) {
        const query = this.abcRepo
            .createQueryBuilder('abc')
            .leftJoinAndSelect('abc.category', 'category')
            .leftJoinAndSelect('abc.subcategory', 'subcategory')
            .leftJoinAndSelect('abc.products', 'products')
            .leftJoinAndSelect('products.offer_type', 'offer_type')
            .leftJoinAndSelect('offer_type.items', 'items')
            .leftJoinAndSelect('items.product', 'item_product')
            .leftJoinAndSelect('abc.abc_type', 'abc_type')
            .orderBy('abc.createdAt', 'DESC');

        const abcTypeQuery = this.abctypeRepo.createQueryBuilder('abctype').orderBy('abctype.createdAt', 'DESC');

        if (country) {
            query.where('abc_type.country = :country', { country });
            abcTypeQuery.where('abctype.country = :country', { country });
        }

        const [data, abcTypes] = await Promise.all([
            query.getMany(),
            abcTypeQuery.getMany()
        ]);

        const grouped = {};
        
        // Initialize all abc_types
        abcTypes.forEach(type => {
            grouped[type.id] = {
                abc_type: type,
                itemsMap: {}
            };
        });

        // Map existing Abc data
        data.forEach(curr => {
            const typeId = curr.abc_type?.id;
            
            // If the abc doesn't have an abc_type or we didn't fetch it, put it in 'other'
            if (!typeId) {
                if (!grouped['other']) {
                    grouped['other'] = {
                        abc_type: { id: null, name: 'Other' },
                        itemsMap: {},
                    };
                }
            } else if (!grouped[typeId]) {
                 grouped[typeId] = {
                     abc_type: curr.abc_type,
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
                    product_data: [],
                };
            }

            if (curr.products && Array.isArray(curr.products)) {
                curr.products.forEach((newProd) => {
                    const alreadyAdded = targetGroup.itemsMap[itemKey].product_data.some(
                        (p) => p.id === newProd.id,
                    );

                    if (!alreadyAdded) {
                        targetGroup.itemsMap[itemKey].product_data.push(newProd);
                    }
                });
            }
        });

        const result = Object.values(grouped).map((group: any) => ({
            abc_type: group.abc_type,
            item: Object.values(group.itemsMap),
        }));

        return {
            success: true,
            message: 'ABC entries fetched successfully',
            data: result,
        };
    }

    async findOne(id: number) {
        const data = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'abc_type'],
        });

        if (!data) throw new NotFoundException('ABC entry not found');

        return {
            success: true,
            message: 'ABC entry fetched successfully',
            data,
        };
    }

    async update(id: number, body: any) {
        const abc = await this.abcRepo.findOne({
            where: { id },
        });

        if (!abc)
            throw new NotFoundException('ABC entry not found');

        if (body.categoryId) body.category = { id: body.categoryId };
        if (body.subCategoryId) body.subcategory = { id: body.subCategoryId };
        if (body.abcTypeId) body.abc_type = { id: body.abcTypeId };

        if (body.product) {
            body.products = [{ id: body.product }];
        } else if (body.productId) {
            body.products = [{ id: body.productId }];
        } else if (body.products && Array.isArray(body.products)) {
            body.products = body.products.map(id => typeof id === 'object' ? id : { id });
        }

        Object.assign(abc, body);
        await this.abcRepo.save(abc);

        const updated = await this.abcRepo.findOne({
            where: { id },
            relations: ['category', 'subcategory', 'products', 'products.offer_type', 'products.offer_type.items', 'products.offer_type.items.product', 'abc_type'],
        });

        return {
            success: true,
            message: 'ABC entry updated successfully',
            data: updated,
        };
    }

    async remove(id: number) {
        const abc = await this.abcRepo.findOne({
            where: { id },
        });

        if (!abc)
            throw new NotFoundException('ABC entry not found');

        await this.abcRepo.remove(abc);

        return {
            success: true,
            message: 'ABC entry deleted successfully',
        };
    }
}
