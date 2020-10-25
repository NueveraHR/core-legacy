import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { IgnorePrivileges } from '@hrms-api/common/decorators/privileges.decorator';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { FileUtils } from '@hrms-api/common/utils/file.utils';
import { FileData } from '@hrms-core/common/interfaces/file.interface';
import { UserDto } from '@hrms-core/user/user.dto';
import { EmployeeFacade } from '@hrms-facades/employee/employee.facade';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server';
import { FileUpload } from 'graphql-upload';
import { isOwner } from './employee.resolver';
import {
    AddCertificationInput,
    UpdateCertificationInput,
} from './graphql/employee.input';
import { Certification, Employee } from './graphql/employee.type';

@Resolver()
@RateLimit({ limit: 100, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class CertificationResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addCertification(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('cert') cert: AddCertificationInput,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }

        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }
        return this.employeeFacade
            .addCertification(employeeId, cert, fileData)
            .catch(GqlError);
    }

    @Mutation(() => Certification)
    @IgnorePrivileges()
    updateCertification(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('certId', { type: () => ID }) certId: string,
        @Args('cert') cert: UpdateCertificationInput,
        @Args('deleteDocument', { type: () => Boolean, nullable: true })
        deleteDocument: boolean,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }

        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }
        return this.employeeFacade
            .updateCertification(employeeId, certId, cert, deleteDocument, fileData)
            .catch(GqlError);
    }

    @Mutation(() => Boolean)
    @IgnorePrivileges()
    deleteCertification(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('certId', { type: () => ID }) certId: string,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.deleteCertification(certId).catch(GqlError);
    }
}
