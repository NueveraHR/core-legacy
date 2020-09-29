import { ErrorDto } from './../../../../hrms-core/src/common/error/error.service';
import { ApolloError } from 'apollo-server';

export class ApolloErrorAdapter extends ApolloError {
    constructor(err: ErrorDto) {
        super(err.message, `${err.statusCode}`, err.detailedMessage);
    }
}

export const GqlError = (err: ErrorDto) => {
    return new ApolloErrorAdapter(err);
};

export const FORBIDDEN_ERROR = GqlError({ statusCode: 403, message: 'Forbidden resource' });
