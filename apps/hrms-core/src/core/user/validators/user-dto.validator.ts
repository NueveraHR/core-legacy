import { DtoValidator, ValidatorOptions } from '@hrms-core/common/interfaces/dto-validator';
import { ErrorDto, ErrorService } from '@hrms-core/common/error/error.service';
import { Injectable, Inject } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ValidatorUtils } from '@hrms-core/common/utils/validator.utils';
import { Errors } from '@hrms-core/common/error/error.const';

const EMAIL_PATTERN = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

@Injectable()
export class UserDtoValidator extends DtoValidator<UserDto> {
    @Inject(ErrorService) errorService: ErrorService;

    validate(object: UserDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {
        if (!object) {
            return this.errorService.generate(Errors.User.NO_DATA);
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!ValidatorUtils.isValidId(object.id)) {
                return this.errorService.generate(Errors.User.INVALID_USER_ID);
            }
        }

        if (object.firstName === '') {
            return this.errorService.generate(Errors.User.MISSING_FIRSTNAME);
        }

        if (object.lastName === '') {
            return this.errorService.generate(Errors.User.MISSING_LASTNAME);
        }

        if (object.birthDate?.getTime() > new Date().getTime()) {
            return this.errorService.generate(Errors.User.MISSING_BIRTHDATE);
        }

        if (object.gender === '') {
            return this.errorService.generate(Errors.User.MISSING_GENDER);
        }

        if (object.cin && object.cin.length != 8) {
            return this.errorService.generate(Errors.User.MISSING_CIN);
        }

        if (this.isRequired('password', validatorOptions)) {
            if (!object.password) {
                return this.errorService.generate(Errors.User.MISSING_PASSWORD);
            }
        }

        if (object.username === '') {
            return this.errorService.generate(Errors.User.MISSING_USERNAME);
        }

        if (object.email && !EMAIL_PATTERN.test(object.email)) {
            return this.errorService.generate(Errors.User.INVALID_EMAIL);
        }

        if (object.prefix === '') {
            return this.errorService.generate(Errors.User.MISSING_PREFIX);
        }

        if (object.role && !ValidatorUtils.isValidId(object.role as string)) {
            return this.errorService.generate(Errors.User.INVALID_ROLE_ID);
        }

        if (object.phone === '') {
            return this.errorService.generate(Errors.User.MISSING_PHONE);
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
