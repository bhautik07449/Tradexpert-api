import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    async dashboard() {
        const data = await this.dashboardService.getDashboardData();

        return {
            success: true,
            message: "Dashboard data fetched successfully",
            data,
        };
    }
}