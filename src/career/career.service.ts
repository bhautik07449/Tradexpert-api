import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, ConflictException, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Career } from "./entities/career.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CareerService {
    constructor(
        @InjectRepository(Career)
        private readonly careerRepository: Repository<Career>,
        private readonly jwtService: JwtService
    ) { }

    async create(data: Partial<Career>) {
        try {
            if (!data) {
                throw new BadRequestException('Request body is required');
            }

            if (data.email) {
                const existingEmail = await this.careerRepository.findOne({
                    where: { email: data.email }
                });

                if (existingEmail) {
                    throw new ConflictException({
                        success: false,
                        message: `${data.email} this email id already exists`,
                    });
                }
            }

            const careerData = { ...data };
            if (data.password) {
                careerData.password = await bcrypt.hash(data.password, 10);
            }

            const career = this.careerRepository.create(careerData);

            const saved = await this.careerRepository.save(career);

            return {
                success: true,
                message: 'Career created successfully',
                data: saved,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create Career');
        }
    }

    async findAll(country?: string) {
        try {
            const whereClause: any = {};
            if (country) {
                whereClause.country = country;
            }
            const data = await this.careerRepository.find({
                where: whereClause,
                order: { createdAt: 'DESC' },
            });

            return {
                success: true,
                message: 'Career fetched successfully',
                data,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch Career');
        }
    }

    async findOne(id: number) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career not found');
            }

            return {
                success: true,
                message: 'Career fetched successfully',
                data: career,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<Career>) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career not found');
            }

            if (data.email !== career.email) {
                const existingCareer = await this.careerRepository.findOne({
                    where: { email: data.email, id: Not(id) }
                });
                if (existingCareer) {
                    throw new ConflictException('Email already in use by another career profile');
                }
            }

            Object.assign(career, data);

            const updated = await this.careerRepository.save(career);

            return {
                success: true,
                message: 'Career updated successfully',
                data: updated,
            };
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
            });

            if (!career) {
                throw new NotFoundException('Career Type not found');
            }

            await this.careerRepository.remove(career);

            return {
                success: true,
                message: 'Career deleted successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    async login(loginData: any) {
        const { email, password } = loginData;
        const career = await this.careerRepository.findOne({ where: { email } });

        if (!career) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!career.password) {
            throw new UnauthorizedException('Password not set for this profile');
        }

        const isPasswordMatching = await bcrypt.compare(password, career.password);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: career.email, sub: career.id, role: 'career' };
        const token = this.jwtService.sign(payload);

        return {
            success: true,
            message: 'Login successful',
            token,
            data: career,
        };
    }

    async forgotPassword(data: any) {
        const { email, newPassword } = data;

        if (!email || !newPassword) {
            throw new ConflictException('Email and new password are required');
        }

        const career = await this.careerRepository.findOne({ where: { email } });

        if (!career) {
            throw new NotFoundException(`Career profile with email ${email} not found`);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        career.password = hashedPassword;

        await this.careerRepository.save(career);

        return {
            success: true,
            message: 'Password updated successfully'
        };
    }
}