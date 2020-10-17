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
import {
    PaginationOptions,
    FilterOptions,
} from '@hrms-core/common/interfaces/pagination';
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
import { RegisterFacade } from '@hrms-facades/register/register.facade';

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

        private registerFacade: RegisterFacade,
    ) {}

    // -------------------------------- CRUD ----------------------------------------

    list(
        paginationOptions: PaginationOptions,
        filterOptions?: FilterOptions,
    ): Promise<UserPaginateDto> {
        return this.userService
            .findAllPaginated(
                paginationOptions.page,
                paginationOptions.limit,
                filterOptions,
            )
            .then(result => {
                const userPaginateDto: UserPaginateDto = {
                    total: result.total as number,
                    pages: result.pages as number,
                    page: result.page,
                    limit: result.limit,
                    nextPage: result.nextPage,
                    prevPage: result.prevPage,
                    docs: result.docs,
                };
                return userPaginateDto;
            });
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

    // -------------------------------- Education -----------------------------------

    async addEducation(userId: string, educationDto: EducationDto): Promise<UserDto> {
        //TODO: validate
        const education = await this.educationService.create(educationDto);
        return this.userService.attachEducation(userId, education.id) as UserDto;
    }

    updateEducation(id: string, educationDto: EducationDto): Promise<EducationDto> {
        //TODO: validate
        return this.educationService.update(id, educationDto);
    }

    deleteEducation(id: string): Promise<boolean> {
        return this.educationService.delete(id);
    }

    // -------------------------------- Certification --------------------------------

    async addCertification(
        userId: string,
        certificationDto: CertificationDto,
    ): Promise<UserDto> {
        //TODO: validate
        const cert = await this.certificationService.create(certificationDto);
        return (await this.userService.attachCertification(userId, cert.id)) as UserDto;
    }

    updateCertification(
        id: string,
        certificationDto: CertificationDto,
    ): Promise<CertificationDto> {
        //TODO: validate
        return this.certificationService.update(id, certificationDto);
    }

    deleteCertification(id: string): Promise<boolean> {
        return this.certificationService.delete(id);
    }

    // -------------------------------- Language ---------------------------------------

    async addLanguage(userId: string, languageDto: LanguageDto): Promise<UserDto> {
        //TODO: validate
        const lang = await this.languageService.create(languageDto);
        return this.userService.attachLanguage(userId, lang.id) as UserDto;
    }

    updateLanguage(id: string, languageDto: LanguageDto): Promise<LanguageDto> {
        //TODO: validate
        return this.languageService.update(id, languageDto);
    }

    deleteLanguage(id: string): Promise<boolean> {
        //TODO: validate

        return this.languageService.delete(id);
    }

    // -------------------------------- Passport ---------------------------------------

    async addPassport(userId: string, passportDto: PassportDto): Promise<UserDto> {
        //TODO: validate
        const passport = await this.passportService.create(passportDto);
        return this.userService.setPassport(userId, passport.id);
    }

    updatePassport(id: string, passportDto: PassportDto): Promise<PassportDto> {
        //TODO: validate
        return this.passportService.update(id, passportDto);
    }

    deletePassport(id: string): Promise<boolean> {
        //TODO: validate
        return this.passportService.delete(id);
    }

    // -------------------------------- Skills -----------------------------------------

    async setSkills(userId: string, newSkills: SkillDto[]): Promise<UserDto> {
        //TODO: validate
        const ids = [];
        const promises = [];

        const currentSkills = await this.userService.getSkills(userId);
        currentSkills.forEach(skill => {
            this.skillService.delete(skill.id);
        });

        newSkills.forEach(skillDto => {
            promises.push(
                this.skillService.create(skillDto).then(skill => ids.push(skill.id)),
            );
        });

        await Promise.all(promises);
        return this.userService.setSkills(userId, ids);
    }

    // -------------------------------- Job --------------------------------------------

    async addJob(employeeId: string, jobDto: JobDto): Promise<JobDto> {
        //TODO: validate
        const job = await this.jobService.create(jobDto);
        await this.userService.attachJob(employeeId, job.id);
        return job;
    }

    updateJob(jobId: string, jobDto: JobDto): Promise<JobDto> {
        // TODO: validate
        return this.jobService.update(jobId, jobDto);
    }

    deleteJob(jobId: string): Promise<boolean> {
        // TODO: validate id
        return this.jobService.delete(jobId);
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
