import { Controller, Get } from '@nestjs/common';
import { RoleFacade } from '@hrms-core/modules/config-management/facades/role.facade';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { ErrorDto } from '@hrms-core/common/services/dto/error-dto.service';

@Controller()
export class AppController {
  constructor(
    private readonly roleManagementFacade: RoleFacade
  ) { }

  @Get()
  async getHello() {
    
  }
}