import { ErrorDto } from "@hrms-core/dto/error.dto";

export abstract class DtoValidator<T> {

    /**
     * Checks whether a Dto is valid or not   
     *
     * @param {T} object
     * @param {ValidatorOptions} [validatorOptions]
     * @returns {(boolean | ErrorDto | ErrorDto[])}
     * @memberof DtoValidator
     */
    abstract validate(object: T, validatorOptions?: ValidatorOptions): boolean | ErrorDto | ErrorDto[];



    protected isRequired(fieldName, validatorOptions: ValidatorOptions): boolean {
        const result = validatorOptions?.required?.findIndex(field => field == fieldName);
        return result != null && result != -1;
    }

    protected isOptional(fieldName, validatorOptions: ValidatorOptions): boolean {
        const result = validatorOptions?.optional?.findIndex(field => field == fieldName);
        return result != null && result != -1;
    }
}

export interface ValidatorOptions {
    required?: string[];
    optional?: string[];
}