import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { RoleDto } from "@hrms-core/dto/role.dto";
import { ErrorDto } from "@hrms-core/dto/error.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleDtoValidator extends DtoValidator<RoleDto> {
    
    constructor() {
        super();
    }

    validate(object: RoleDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {
        if (!object) {
            return new ErrorDto('No role data provided!');
        }
        if (!object.name) {
            return new ErrorDto('Invalid role : Missing role name!');
        }
        if (!object.description) {
            return new ErrorDto('Invalid role : Missing role description!');
        }
        if (!object.privileges) {
            return new ErrorDto('Invalid role : Missing set of privileges!');
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return new ErrorDto('Invalid role : Missing role identifier!');
            }
        }

        return true;
    }

}