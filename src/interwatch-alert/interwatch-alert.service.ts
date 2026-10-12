import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { InterwatchAlert, AlertStatus } from './entities/interwatch-alert.entity';

@Injectable()
export class InterwatchAlertService {
    constructor(
        @InjectRepository(InterwatchAlert)
        private readonly alertRepo: Repository<InterwatchAlert>,
    ) { }

    async create(data: Partial<InterwatchAlert>, user?: any) {
        try {
            if (user) {
                if (user.supplierId && !data.supplier_id) {
                    data.supplier_id = user.supplierId;
                }
                if (user.name && !data.supplier_name) {
                    data.supplier_name = user.name;
                }
            }

            if (!data.alert_type && data.reason_type) {
                data.alert_type = data.reason_type;
            } else if (!data.reason_type && data.alert_type) {
                data.reason_type = data.alert_type;
            }

            if (!data.supplier_name) {
                data.supplier_name = 'Supplier';
            }

            const alert = this.alertRepo.create(data);
            const saved = await this.alertRepo.save(alert);

            return {
                success: true,
                message: 'Interwatch Alert recorded successfully',
                data: saved,
            };
        } catch (error) {
            console.error('Error creating Interwatch Alert:', error);
            throw new InternalServerErrorException(error.message || 'Failed to create Interwatch Alert');
        }
    }

    async findAll(query?: { alert_type?: string; category?: string; search?: string; supplier_id?: number }) {
        try {
            const queryBuilder = this.alertRepo.createQueryBuilder('alert')
                .where('alert.status != :deletedStatus', { deletedStatus: AlertStatus.DELETED });

            if (query?.alert_type && query.alert_type.toLowerCase() !== 'all') {
                queryBuilder.andWhere('LOWER(alert.alert_type) = LOWER(:alertType) OR LOWER(alert.reason_type) = LOWER(:alertType)', {
                    alertType: query.alert_type
                });
            }

            if (query?.category && query.category.toLowerCase() !== 'all') {
                queryBuilder.andWhere('LOWER(alert.category) = LOWER(:category)', {
                    category: query.category
                });
            }

            if (query?.supplier_id) {
                queryBuilder.andWhere('alert.supplier_id = :supplierId', {
                    supplierId: query.supplier_id
                });
            }

            if (query?.search) {
                const searchPattern = `%${query.search.toLowerCase()}%`;
                queryBuilder.andWhere(
                    '(LOWER(alert.supplier_name) LIKE :search OR LOWER(alert.reason_desc) LIKE :search OR LOWER(alert.category) LIKE :search OR LOWER(alert.reason_type) LIKE :search)',
                    { search: searchPattern }
                );
            }

            queryBuilder.orderBy('alert.createdAt', 'DESC');

            const data = await queryBuilder.getMany();

            return {
                success: true,
                message: 'Interwatch Alerts fetched successfully',
                data,
                total: data.length,
            };
        } catch (error) {
            console.error('Error fetching Interwatch Alerts:', error);
            throw new InternalServerErrorException('Failed to fetch Interwatch Alerts');
        }
    }

    async findOne(id: number) {
        try {
            const alert = await this.alertRepo.findOne({
                where: { id, status: Not(AlertStatus.DELETED) },
            });

            if (!alert) {
                throw new NotFoundException('Interwatch Alert not found');
            }

            return {
                success: true,
                message: 'Interwatch Alert fetched successfully',
                data: alert,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<InterwatchAlert>) {
        try {
            const alert = await this.alertRepo.findOne({
                where: { id, status: Not(AlertStatus.DELETED) },
            });

            if (!alert) {
                throw new NotFoundException('Interwatch Alert not found');
            }

            Object.assign(alert, data);

            const updated = await this.alertRepo.save(alert);

            return {
                success: true,
                message: 'Interwatch Alert updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const alert = await this.alertRepo.findOne({
                where: { id, status: Not(AlertStatus.DELETED) },
            });

            if (!alert) {
                throw new NotFoundException('Interwatch Alert not found');
            }

            alert.status = AlertStatus.DELETED;
            await this.alertRepo.save(alert);

            return {
                success: true,
                message: 'Interwatch Alert deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    async getStats() {
        try {
            const total = await this.alertRepo.count({
                where: { status: Not(AlertStatus.DELETED) }
            });

            const pending = await this.alertRepo.count({
                where: { status: Not(AlertStatus.DELETED), action_status: 'Pending' }
            });

            const resolved = await this.alertRepo.count({
                where: { status: Not(AlertStatus.DELETED), action_status: 'Resolved' }
            });

            const recentAlerts = await this.alertRepo.find({
                where: { status: Not(AlertStatus.DELETED) },
                order: { createdAt: 'DESC' },
                take: 5
            });

            return {
                success: true,
                data: {
                    total,
                    pending,
                    resolved,
                    recentAlerts
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch Interwatch Alert stats');
        }
    }
}
