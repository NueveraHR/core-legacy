import { DtoValidator, ValidatorOptions } from '@hrms-core/common/interfaces/dto-validator';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { ErrorDto, ErrorService } from '@hrms-core/common/error/error.service';
import { Injectable, Inject } from '@nestjs/common';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class RoleDtoValidator extends DtoValidator<RoleDto> {
    @Inject(ErrorService) errorService: ErrorService;

    constructor() {
        super();
    }

    validate(object: RoleDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {
        if (!object) {
            return this.errorService.generate(Errors.Role.NO_DATA);
        }
        if (!object.name) {
            return this.errorService.generate(Errors.Role.MISSING_NAME);
        }
        if (!object.description) {
            return this.errorService.generate(Errors.Role.MISSING_DESCRIPTION);
        }
        if (!object.privileges) {
            return this.errorService.generate(Errors.Role.MISSING_PRIVILEGES);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return this.errorService.generate(Errors.Role.MISSING_ID);
            }
        }

        return true;
    }
}
