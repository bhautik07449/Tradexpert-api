import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Membership])],
    providers: [MembershipService],
    controllers: [MembershipController],
    exports: [MembershipService],
})
export class MembershipModule { }