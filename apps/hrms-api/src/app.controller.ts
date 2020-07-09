import { Controller, Get } from '@nestjs/common';
import { RoleManagementFacade } from '@hrms-core/modules/config-management/facades/role-management.facade';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';

@Controller()
export class AppController {
  constructor(
    private readonly roleManagementFacade: RoleManagementFacade
  ) { }

  @Get()
  async getHello() {
    return await this.roleManagementFacade.createRole(employeeRole).then(res => {
      return res;
    }).catch(err => {
      return new ErrorDto(err.message);
    });

  }
}

const employeeRole = {
  name: 'employee',
  description: 'Enterprise employee',
  privileges: {
    user: {
      portals: [
        "self-service"
      ],
      pages: [
        "my-profile"
      ],
      actions: [
        "my-profile.requests.create",
        "my-profile.requests.read",
        "my-profile.requests.update",
        "my-profile.requests.delete",

        "my-profile.documents.add",
        "my-profile.documents.read",
        "my-profile.documents.update",
        "my-profile.documents.delete"
      ]
    }
  }
}