import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { FileUtils } from '@hrms-api/common/utils/file.utils';
import { FileData } from '@hrms-core/common/interfaces/file';
import { UserDto } from '@hrms-core/user/user.dto';
import { EmployeeFacade } from '@hrms-facades/employee/employee.facade';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server';
import { FileUpload } from 'graphql-upload';
import { isOwner } from './employee.resolver';
import { JobInput, UpdateJobInput } from './graphql/employee.input';
import { Job } from './graphql/employee.type';

@Resolver()
@RateLimit({ limit: 100, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class JobResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Mutation(() => Job)
    addJob(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('job') job: JobInput,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document?: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }

        return this.employeeFacade.addJob(employeeId, job, fileData).catch(GqlError);
    }

    @Mutation(() => Job)
    updateJob(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('jobId', { type: () => ID }) jobId: string,
        @Args('job') job: UpdateJobInput,
        @Args('deleteDocument', { type: () => Boolean, nullable: true })
        deleteDocument?: boolean,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document?: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }

        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }

        return this.employeeFacade
            .updateJob(jobId, job, deleteDocument, fileData)
            .catch(GqlError);
    }

    @Mutation(() => Boolean)
    deleteJob(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('jobId', { type: () => ID }) jobId: string,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.deleteJob(jobId).catch(GqlError);
    }
}
