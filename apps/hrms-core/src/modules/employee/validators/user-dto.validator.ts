import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { ErrorDto, ErrorService } from "@hrms-core/common/error/error.service";
import { Injectable, Inject } from "@nestjs/common";
import { UserDto } from "@hrms-core/dto/user.dto";
import { ValidatorUtils } from "@hrms-core/common/utils/validator.utils";

const EMAIL_PATTERN = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


@Injectable()
export class UserDtoValidator extends DtoValidator<UserDto> {

    @Inject(ErrorService) errorService: ErrorService;

    validate(object: UserDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {

        if (!object) {
            return this.errorService.generate(42100);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return this.errorService.generate(42101);
            }
        }

        if (!object.username) {
            return this.errorService.generate(42102);
        }

        if (!object.firstName) {
            return this.errorService.generate(42103);
        }


        if (!object.lastName) {
            return this.errorService.generate(42104);
        }


        if (this.isRequired('password', validatorOptions)) {
            if (!object.password) {
                return this.errorService.generate(42105);
            }
        }

        if (!object.email) {
            return this.errorService.generate(42106);
        }

        if (EMAIL_PATTERN.test(object.email) === false) {
            return this.errorService.generate(42107);
        }

        if (!object.cin) {
            return this.errorService.generate(42108);
        }

        if (object.cin.length != 8) {
            return this.errorService.generate(42115);
        }

        if (!object.prefix) {
            return this.errorService.generate(42109);
        }


        if (!object.role) {
            return this.errorService.generate(42110);
        }

        if (!ValidatorUtils.isValidId(object.role)) {
            return (this.errorService.generate(42200));
        }

        if (!object.gender) {
            return this.errorService.generate(42111);
        }


        if (!object.phone) {
            return this.errorService.generate(42112);
        }


        // if (!object.modeOfEmployment) {
        //     return this.errorService.error(42113);
        // }


        // if (!object.department) {
        //     return this.errorService.error(42114);
        // }

        return true;
    }
}