import { DtoValidator, ValidatorOptions } from "@hrms-core/common/interfaces/dto-validator";
import { ErrorDto } from "@hrms-core/dto/error.dto";
import { Injectable } from "@nestjs/common";
import { UserDto } from "@hrms-core/dto/user.dto";

const EMAIL_PATTERN = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


@Injectable()
export class UserDtoValidator extends DtoValidator<UserDto> {

    validate(object: UserDto, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[] {

        if (!object) {
            return new ErrorDto('No user data provided!');
        }

        if (this.isRequired('id', validatorOptions)) {
            if (!object.id) {
                return new ErrorDto('Invalid user : Missing user identifier!');
            }
        }

        if (!object.username) {
            return new ErrorDto('Invalid user : Missing username!');
        }

        if (!object.firstName) {
            return new ErrorDto('Invalid user : Missing first name!');
        }


        if (!object.lastName) {
            return new ErrorDto('Invalid user : Missing last name!');
        }


        if (this.isRequired('password', validatorOptions)) {
            if (!object.password) {
                return new ErrorDto('Invalid user : Missing password!');
            }
        }

        if (!object.email) {
            return new ErrorDto('Invalid user : Missing email!');
        }

        if (EMAIL_PATTERN.test(object.email) === false) {
            return new ErrorDto('Invalid user : invalid email provided');
        }

        if (!object.cin) {
            return new ErrorDto('Invalid user : Missing cin!');
        }


        if (!object.prefix) {
            return new ErrorDto('Invalid user : Missing prefix!');
        }


        if (!object.role) {
            return new ErrorDto('Invalid user : Missing role!');
        }


        if (!object.gender) {
            return new ErrorDto('Invalid user : Missing gender!');
        }


        if (!object.phone) {
            return new ErrorDto('Invalid user : Missing phone!');
        }


        if (!object.modeOfEmployment) {
            return new ErrorDto('Invalid user : Missing mode of employment!');
        }


        if (!object.department) {
            return new ErrorDto('Invalid user : Missing department!');
        }

        return true;
    }
}