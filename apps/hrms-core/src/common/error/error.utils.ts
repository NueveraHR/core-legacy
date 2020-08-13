import { ErrorDto } from "@hrms-core/common/error/error.service";
import { HttpStatus } from "@nestjs/common";

export class ErrorUtils {
    static responseCode(err: ErrorDto): number {

        if (!err?.statusCode) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorCode = err.statusCode.toString();

        if (errorCode[0] == '5') {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        } else if (errorCode[0] == '4') {
            return HttpStatus.BAD_REQUEST;
        };
    }
}