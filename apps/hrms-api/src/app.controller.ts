import { Controller, Get } from '@nestjs/common';
import { RoleFacade } from '@hrms-core/modules/config/facades/role.facade';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { ErrorDto } from '@hrms-core/common/error/error.service';

@Controller()
export class AppController {
  constructor( ) { }
}