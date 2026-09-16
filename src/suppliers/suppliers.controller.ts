import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Patch,
    Query,
    Res,
    Request,
    UnauthorizedException,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    // @UseGuards(AdminAuthGuard)
    create(@Body() body: Partial<Supplier>) {
        return this.suppliersService.create(body);
    }

    @Post('login')
    async login(@Body() body: any, @Res({ passthrough: true }) response: any) {
        const result = await this.suppliersService.login(body);
        const token = result?.token || result?.access_token;
        const supplierId = result?.supplier?.id || result?.data?.id || result?.id;

        if (token) {
            response.cookie('supplier_token', String(token), {
                domain: '.sourceseas.com',
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            response.cookie('token', String(token), {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
        } else if (supplierId) {
            response.cookie('supplier_token', String(supplierId), {
                domain: '.sourceseas.com',
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
        }
        return result;
    }

    @Get('profile')
    async getProfile(@Request() req: any) {
        let supplierId: number | null = req?.user?.supplierId || null;
        if (!supplierId) {
            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7).replace(/^"|"$/g, '').trim();
                if (!isNaN(Number(token)) && Number(token) > 0) {
                    supplierId = Number(token);
                } else {
                    try {
                        const decoded: any = this.suppliersService['jwtService']?.decode(token);
                        if (decoded && decoded.sub) {
                            supplierId = Number(decoded.sub);
                        }
                    } catch (err) { }
                }
            }
        }

        if (!supplierId) {
            const supplierIdHeader = req.headers['x-supplier-id'] || req.headers['supplier_id'];
            if (supplierIdHeader) {
                supplierId = Number(supplierIdHeader);
            }
        }

        if (!supplierId) {
            throw new UnauthorizedException('Invalid or missing supplier token');
        }

        const supplier = await this.suppliersService.findOne(supplierId);
        return {
            success: true,
            message: 'Supplier profile fetched successfully',
            data: supplier
        };
    }

    @Post('logout')
    async logout(@Request() req: any, @Body() body: any) {
        let tokenOrId = '';
        const authHeader = req.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            tokenOrId = authHeader.substring(7);
        } else if (body && body.token) {
            tokenOrId = body.token;
        } else if (body && body.id) {
            tokenOrId = body.id;
        }
        return await this.suppliersService.logout(tokenOrId);
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: any) {
        return this.suppliersService.forgotPassword(body);
    }

    @Get()
    findAll(@Query('country') country?: string) {
        return this.suppliersService.findAll(country);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Supplier>,
    ) {
        return this.suppliersService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.suppliersService.remove(id);
    }
}