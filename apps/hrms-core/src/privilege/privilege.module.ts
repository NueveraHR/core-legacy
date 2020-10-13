import { Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';

@Module({
    providers: [PrivilegeService],
    exports: [PrivilegeService],
})
export class PrivilegeModule {}
