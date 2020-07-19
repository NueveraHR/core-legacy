import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { ErrorDto, DtoService } from "@hrms-core/common/services/dto/error-dto.service";
import { Injectable, Inject } from "@nestjs/common";
import { UserDto } from "@hrms-core/dto/user.dto";

const EMAIL_PATTERN = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


@Injectable()
export class UserDtoValidator extends DtoValidator<UserDto> {
    
    @Inject(DtoService) dtoService: DtoService;

    validate(object: UserDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {

        if (!object) {
            return this.dtoService.error(42100);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return this.dtoService.error(42101);
            }
        }

        if (!object.username) {
            return this.dtoService.error(42102);
        }

        if (!object.firstName) {
            return this.dtoService.error(42103);
        }


        if (!object.lastName) {
            return this.dtoService.error(42104);
        }


        if (this.isRequired('password', validatorOptions)) {
            if (!object.password) {
                return this.dtoService.error(42105);
            }
        }

        if (!object.email) {
            return this.dtoService.error(42106);
        }

        if (EMAIL_PATTERN.test(object.email) === false) {
            return this.dtoService.error(42107);
        }

        if (!object.cin) {
            return this.dtoService.error(42108);
        }

        if(object.cin.length != 8) {
            return this.dtoService.error(42115);
        }

        if (!object.prefix) {
            return this.dtoService.error(42109);
        }


        if (!object.role) {
            return this.dtoService.error(42110);
        }


        if (!object.gender) {
            return this.dtoService.error(42111);
        }


        if (!object.phone) {
            return this.dtoService.error(42112);
        }


        if (!object.modeOfEmployment) {
            return this.dtoService.error(42113);
        }


        if (!object.department) {
            return this.dtoService.error(42114);
        }

        return true;
    }
}