import { PassportDto } from '@hrms-core/user/passport/passport.dto';
import { SocialLinkService } from '@hrms-core/user/social-links/social-links.service';
import {
    CertificationDto,
    EducationDto,
    LanguageDto,
    UserDto,
    UserPaginateDto,
} from '@hrms-core/user/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '@hrms-core/user/user.service';
import { LoggerService } from '@libs/logger';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { UserDtoValidator } from '@hrms-core/user/validators/user-dto.validator';
import { RoleService } from '@hrms-core/role/role.service';
import { UserDtoReversePipe } from '@hrms-core/user/pipes/user-dto-reverse.pipe';
import { Errors } from '@hrms-core/common/error/error.const';
import { AddressService } from '@hrms-core/address/address.service';
import { AddressDto } from '@hrms-core/address/address.dto';
import { PaginationOptions } from '@hrms-core/common/interfaces/pagination';
import { FilterOptions } from '@hrms-core/common/interfaces/filter';
import { Address } from '@hrms-core/address/address.schema';
import { EducationService } from '@hrms-core/user/education/education.service';
import { CertificationService } from '@hrms-core/user/certification/certification.service';
import { LanguageService } from '@hrms-core/user/language/language.service';
import { SkillDto } from '@hrms-core/user/skill/skill.dto';
import { SkillService } from '@hrms-core/user/skill/skill.service';
import { SocialLinksDto } from '@hrms-core/user/social-links/social-links.dto';
import { SocialLinks } from '@hrms-core/user/social-links/social-links.schema';
import { PassportService } from '@hrms-core/user/passport/passport.service';
import { JobService } from '@hrms-core/job/job.service';
import { JobDto } from '@hrms-core/job/job.dto';
import { RegisterFacade } from '@hrms-facades/auth/register.facade';
import * as bcrypt from 'bcrypt';
import { DocumentMangmentService } from '@hrms-core/document/document-mangment.service';
import { FileData } from '@hrms-core/common/interfaces/file';
import { Passport } from '@hrms-core/user/passport/passport.schema';
import { EmployeesFilterManagerService } from './filters/filter-manager.service';

@Injectable()
export class EmployeeFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        private logger: LoggerService,
        private userDtoValidator: UserDtoValidator,
        private userDtoReversePipe: UserDtoReversePipe,
        private userService: UserService,
        private roleService: RoleService,
        private addressService: AddressService,
        private educationService: EducationService,
        private certificationService: CertificationService,
        private languageService: LanguageService,
        private skillService: SkillService,
        private socialLinkService: SocialLinkService,
        private passportService: PassportService,
        private jobService: JobService,
        private documentManagementService: DocumentMangmentService,
        private registerFacade: RegisterFacade,

        private employeesFilterManager: EmployeesFilterManagerService,
    ) {}

    // -------------------------------- CRUD ----------------------------------------

    list(
        paginationOptions: PaginationOptions,
        filterOptions?: FilterOptions,
    ): Promise<UserPaginateDto> {
        const strategy = this.employeesFilterManager.getStrategy(filterOptions);
        return strategy.filter({ paginationOptions, filterOptions });
    }

    async create(userDto: UserDto): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto, {
            required: ['role'],
        });

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // assert role existence
        await this.roleService.assertExists(userDto.role as string);

        // create corresponding address and reassign its id to user
        userDto.address = (
            await this.addressService.create((userDto.address ?? {}) as AddressDto)
        ).id;

        // create corresponding social media links and reassign its id to user
        userDto.socialLinks = (
            await this.socialLinkService.create(
                (userDto.socialLinks ?? {}) as SocialLinksDto,
            )
        ).id;

        // populate missing user props with default values
        this.populateMissingValues(userDto);

        return this.registerFacade.register(userDto);
    }

    async details(id: string): Promise<UserDto> {
        const user = await this.userService.findById(id);
        if (!user) {
            return Promise.reject(
                this.errorService.generate(Errors.User.DETAILS_INVALID_REQUEST),
            );
        }
        return user as UserDto;
    }

    async update(userDto: UserDto): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto);

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        const user = await this.userService.findById(userDto.id);
        if (!user) {
            return Promise.reject(
                this.errorService.generate(Errors.User.UPDATE_UNKNOWN_ID),
            );
        }

        this.userDtoReversePipe.transformExistent(userDto, user);

        // TODO : do not update if nothing has been modified
        await this.addressService.update(user.address as Address);
        await this.socialLinkService.update(user.socialLinks as SocialLinks);

        return this.userService.update(user);
    }

    async updatePassword(
        employeeId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<boolean> {
        const user = await this.userService.findById(employeeId);
        if (!user) {
            return Promise.reject(
                this.errorService.generate(Errors.User.UPDATE_UNKNOWN_ID),
            );
        }
        if (user.password === undefined) {
            return Promise.reject(
                this.errorService.generate(Errors.User.UPDATE_INACTIVE_ACCOUNT),
            );
        }

        const pwdConfirm = await bcrypt.compare(currentPassword, user.password);
        if (pwdConfirm) {
            user.password = newPassword;
            return (await this.userService.update(user)) !== null;
        } else {
            return Promise.reject(
                this.errorService.generate(Errors.User.UPDATE_INVALID_PASSWORD),
            );
        }
    }

    async updateProfilePicture(employeeId: string, fileData: FileData) {
        const imgPath = await this.documentManagementService.uploadToImgpush(fileData);
        await this.userService.updatePicture(employeeId, imgPath);

        return {
            imagePath: imgPath,
        };
    }
    // -------------------------------- Education -----------------------------------

    async addEducation(
        employeeId: string,
        educationDto: EducationDto,
        fileData?: FileData,
    ): Promise<UserDto> {
        //TODO: validate
        const education = await this.educationService.create(educationDto);

        if (fileData) {
            fileData.name = education.id;
            const doc = await this.documentManagementService.save(fileData, employeeId);
            this.educationService.update(education.id, { document: doc.id });
        }

        return this.userService.attachEducation(employeeId, education.id) as UserDto;
    }

    async updateEducation(
        employeeId: string,
        educationId: string,
        educationDto: EducationDto,
        deleteDocument: boolean,
        fileData?: FileData,
    ): Promise<EducationDto> {
        //TODO: validate
        const education = await this.educationService.findById(educationId);
        if (!education) {
            throw Error('Invalid education id');
        }

        const documentId = education.document?.toString();
        if (deleteDocument && documentId) {
            // delete document
            await this.documentManagementService.delete(documentId);
            educationDto.document = null;
        } else if (fileData) {
            fileData.name = educationId;
            if (documentId) {
                await this.documentManagementService.update(documentId, fileData); // Update existing document
            } else {
                // Add a new document
                const doc = await this.documentManagementService.save(
                    fileData,
                    employeeId,
                );
                educationDto.document = doc.id;
            }
        }

        return this.educationService.update(educationId, educationDto);
    }

    async deleteEducation(id: string): Promise<boolean> {
        const education = await this.educationService.findById(id);
        if (education) {
            if (education.document) {
                this.documentManagementService.delete(education.document.toString());
            }
            this.userService.detachEducation(id);
            return this.educationService.delete(id);
        }

        return false;
    }

    // -------------------------------- Certification --------------------------------

    async addCertification(
        employeeId: string,
        certificationDto: CertificationDto,
        fileData?: FileData,
    ): Promise<UserDto> {
        //TODO: validate
        const cert = await this.certificationService.create(certificationDto);

        if (fileData) {
            fileData.name = cert.id;
            const doc = await this.documentManagementService.save(fileData, employeeId);
            this.certificationService.update(cert.id, { document: doc.id });
        }

        return (await this.userService.attachCertification(
            employeeId,
            cert.id,
        )) as UserDto;
    }

    async updateCertification(
        employeeId: string,
        certId: string,
        certificationDto: CertificationDto,
        deleteDocument: boolean,
        fileData?: FileData,
    ): Promise<CertificationDto> {
        //TODO: validate
        const cert = await this.certificationService.findById(certId);
        if (!cert) {
            throw Error('Invalid cert id');
        }

        const documentId = cert.document?.toString();
        if (deleteDocument && documentId) {
            // delete document
            await this.documentManagementService.delete(documentId);
            certificationDto.document = null;
        } else if (fileData) {
            fileData.name = cert.id;
            if (documentId) {
                await this.documentManagementService.update(documentId, fileData); // Update existing document
            } else {
                // Add a new document
                const doc = await this.documentManagementService.save(
                    fileData,
                    employeeId,
                );
                certificationDto.document = doc.id;
            }
        }

        return this.certificationService.update(certId, certificationDto);
    }

    async deleteCertification(id: string): Promise<boolean> {
        const cert = await this.certificationService.findById(id);
        if (cert) {
            if (cert.document) {
                this.documentManagementService.delete(cert.document.toString());
            }
            this.userService.detachCertification(id);
            return this.certificationService.delete(id);
        }
        return false;
    }

    // -------------------------------- Language ---------------------------------------

    async addLanguage(employeeId: string, languageDto: LanguageDto): Promise<UserDto> {
        //TODO: validate
        const lang = await this.languageService.create(languageDto);
        return this.userService.attachLanguage(employeeId, lang.id) as UserDto;
    }

    updateLanguage(id: string, languageDto: LanguageDto): Promise<LanguageDto> {
        //TODO: validate
        return this.languageService.update(id, languageDto);
    }

    async deleteLanguage(id: string): Promise<boolean> {
        //TODO: validate
        this.userService.detachLanguage(id);
        return this.languageService.delete(id);
    }

    // -------------------------------- Passport ---------------------------------------

    async addPassport(
        employeeId: string,
        passportDto: PassportDto,
        fileData?: FileData,
    ): Promise<UserDto> {
        //TODO: validate
        const passport = await this.passportService.create(passportDto);

        if (fileData) {
            fileData.name = passport.id;
            const doc = await this.documentManagementService.save(fileData, employeeId);
            this.passportService.update(passport.id, { document: doc.id });
        }

        return this.userService.setPassport(employeeId, passport.id);
    }

    async updatePassport(
        employeeId: string,
        passportId: string,
        passportDto: PassportDto,
        deleteDocument: boolean,
        fileData?: FileData,
    ): Promise<PassportDto> {
        //TODO: validate
        const passport = await this.passportService.findById(passportId);
        if (!passport) {
            throw Error('Invalid passport id');
        }

        const documentId = passport.document?.toString();
        if (deleteDocument && documentId) {
            // delete document
            await this.documentManagementService.delete(documentId);
            passportDto.document = null;
        } else if (fileData) {
            fileData.name = passportId;
            if (documentId) {
                await this.documentManagementService.update(documentId, fileData); // Update existing document
            } else {
                // Add a new document
                const doc = await this.documentManagementService.save(
                    fileData,
                    employeeId,
                );
                passportDto.document = doc.id;
            }
        }

        return this.passportService.update(passportId, passportDto);
    }

    async deletePassport(employeeId: string): Promise<boolean> {
        //TODO: validate
        const user = await this.userService.findById(employeeId);
        if (user) {
            const passport = user.passport as Passport;
            if (passport) {
                if (passport.document) {
                    this.documentManagementService.delete(passport.document.toString());
                }
                user.passport = null;
                this.userService.update(user);
                return this.passportService.delete(passport.id);
            }
        }
        return false;
    }

    // -------------------------------- Skills -----------------------------------------

    async setSkills(employeeId: string, newSkills: SkillDto[]): Promise<UserDto> {
        //TODO: validate
        const ids = [];
        const promises = [];

        const currentSkills = await this.userService.getSkills(employeeId);
        currentSkills.forEach(skill => {
            this.skillService.delete(skill.id);
        });

        newSkills.forEach(skillDto => {
            promises.push(
                this.skillService.create(skillDto).then(skill => ids.push(skill.id)),
            );
        });

        await Promise.all(promises);
        return this.userService.setSkills(employeeId, ids);
    }

    // -------------------------------- Job --------------------------------------------

    async addJob(
        employeeId: string,
        jobDto: JobDto,
        fileData?: FileData,
    ): Promise<JobDto> {
        //TODO: validate
        const job = await this.jobService.create(jobDto);

        if (fileData) {
            fileData.name = job.id;
            const doc = await this.documentManagementService.save(fileData, employeeId);
            this.jobService.update(job.id, { document: doc.id });
        }

        await this.userService.attachJob(employeeId, job.id);
        return job;
    }

    async updateJob(
        employeeId: string,
        jobId: string,
        jobDto: JobDto,
        deleteDocument: boolean,
        fileData?: FileData,
    ): Promise<JobDto> {
        //TODO: validate
        const job = await this.jobService.findById(jobId);
        if (!job) {
            throw Error('Invalid job id');
        }

        const documentId = job.document?.toString();
        if (deleteDocument && documentId) {
            // delete document
            await this.documentManagementService.delete(documentId);
            jobDto.document = null;
        } else if (fileData) {
            fileData.name = jobId;
            if (documentId) {
                await this.documentManagementService.update(documentId, fileData); // Update existing document
            } else {
                // Add a new document
                const doc = await this.documentManagementService.save(
                    fileData,
                    employeeId,
                );
                jobDto.document = doc.id;
            }
        }

        return this.jobService.update(jobId, jobDto);
    }

    async deleteJob(jobId: string): Promise<boolean> {
        // TODO: validate id
        const job = await this.jobService.findById(jobId);
        if (job) {
            if (job.document) {
                this.documentManagementService.delete(job.document.toString());
            }
            this.userService.detachJob(jobId);
            return this.jobService.delete(jobId);
        }
        return false;
    }

    private populateMissingValues(userDto: UserDto): void {
        if (!userDto.username) {
            userDto.username = userDto.email.substring(0, userDto.email.lastIndexOf('@'));
        }

        if (!userDto.prefix) {
            const gender = userDto.gender.toUpperCase();
            let prefix: string;

            switch (gender) {
                case 'MALE':
                    prefix = 'Mr.';
                    break;
                case 'FEMALE':
                    prefix = 'Mrs.';
                    break;
                default:
                    prefix = 'Mx.';
            }
            userDto.prefix = prefix;
        }
    }
}
