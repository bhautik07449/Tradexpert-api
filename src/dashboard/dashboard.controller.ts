import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { AdminAuthGuard } from "src/auth/admin-auth.guard";
import { AdminOrServiceAuthGuard } from "src/auth/admin-or-service-auth.guard";
import { AdminOrSupplierAuthGuard } from "src/auth/admin-or-supplier-auth.guard";

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    @UseGuards(AdminAuthGuard)
    async dashboard() {
        const data = await this.dashboardService.getDashboardData();

        return {
            success: true,
            message: "Dashboard data fetched successfully",
            data,
        };
    }

    @Get('/service')
    @UseGuards(AdminOrServiceAuthGuard)
    async getServiceDashboard() {
        const data = await this.dashboardService.getServiceDashboardData();

        return {
            success: true,
            message: "Service dashboard data fetched successfully",
            data,
        };
    }

    @Get('/supplier')
    @UseGuards(AdminOrSupplierAuthGuard)
    async getSupplierDashboard() {
        const data = await this.dashboardService.getSupplierDashboardData();

        return {
            success: true,
            message: "Supplier dashboard data fetched successfully",
            data,
        };
    }

    @Get('/front')
    async dashboardFront() {
        const data = await this.dashboardService.getDashboardData();

        return {
            success: true,
            message: "Dashboard data fetched successfully",
            data,
        };
    }
}