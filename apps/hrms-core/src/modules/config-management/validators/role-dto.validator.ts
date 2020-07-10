import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { RoleDto } from "@hrms-core/dto/role.dto";
import { ErrorDto, DtoService } from "@hrms-core/common/services/dto/error-dto.service";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class RoleDtoValidator extends DtoValidator<RoleDto> {
    @Inject(DtoService) dtoService: DtoService;

    constructor() {
        super();
    }

    validate(object: RoleDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {
        if (!object) {
            return this.dtoService.error(43100);
        }
        if (!object.name) {
            return this.dtoService.error(43101);
        }
        if (!object.description) {
            return this.dtoService.error(43102);
        }
        if (!object.privileges) {
            return this.dtoService.error(43103);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return this.dtoService.error(43104);
            }
        }

        return true;
    }

}