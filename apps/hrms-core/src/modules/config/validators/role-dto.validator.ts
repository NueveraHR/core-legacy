import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { RoleDto } from "@hrms-core/dto/role.dto";
import { ErrorDto, ErrorService } from "@hrms-core/common/error/error.service";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class RoleDtoValidator extends DtoValidator<RoleDto> {
    @Inject(ErrorService) errorService: ErrorService;

    constructor() {
        super();
    }

    validate(object: RoleDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {
        if (!object) {
            return this.errorService.generate(43100);
        }
        if (!object.name) {
            return this.errorService.generate(43101);
        }
        if (!object.description) {
            return this.errorService.generate(43102);
        }
        if (!object.privileges) {
            return this.errorService.generate(43103);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return this.errorService.generate(43104);
            }
        }

        return true;
    }

}