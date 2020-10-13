import { PassportDto } from './../dto/passport.dto';
import { SocialLinkService } from './../core/user/social-links/social-links.service';
import { CertificationDto, EducationDto, LanguageDto, UserDto } from '@hrms-core/dto/user.dto';
import { Inject } from '@nestjs/common';
import { UserService } from '@hrms-core/core/user/user.service';
import { LoggerService } from '@libs/logger';
import { UserDtoPipe } from '../core/user/pipes/user-dto.pipe';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { UserDtoValidator } from '../core/user/validators/user-dto.validator';
import { RoleService } from '@hrms-core/core/role/role.service';
import { UserDtoReversePipe } from '../core/user/pipes/user-dto-reverse.pipe';
import { Errors } from '@hrms-core/common/error/error.const';
import { AddressService } from '@hrms-core/core/address/address.service';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { PaginationOptions, NvrPaginateResult, FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { Address } from '@hrms-core/core/address/address.schema';
import { EducationService } from '@hrms-core/core/user/education/education.service';
import { CertificationService } from '@hrms-core/core/user/certification/certification.service';
import { LanguageService } from '@hrms-core/core/user/language/language.service';
import { SkillDto } from '@hrms-core/dto/skill.dto';
import { SkillService } from '@hrms-core/core/user/skill/skill.service';
import { SocialLinksDto } from '@hrms-core/dto/social-links.dto';
import { SocialLinks } from '@hrms-core/core/user/social-links/social-links.schema';
import { PassportService } from '@hrms-core/core/user/passport/passport.service';

export class UserFacade {
    constructor(
        protected logger: LoggerService,
        protected userDtoValidator: UserDtoValidator,
        protected userDtoPipe: UserDtoPipe,
        protected userDtoReversePipe: UserDtoReversePipe,
        protected userService: UserService,
        protected roleService: RoleService,
        protected addressService: AddressService,
        protected educationService: EducationService,
        protected certificationService: CertificationService,
        protected languageService: LanguageService,
        protected skillService: SkillService,
        protected socialLinkService: SocialLinkService,
        protected passportService: PassportService,
    ) {}

    @Inject(ErrorService) errorService: ErrorService;

    list(paginationOptions: PaginationOptions, filterOptions?: FilterOptions): Promise<UserPaginateDto> {
        return this.userService
            .findAllPaginated(paginationOptions.page, paginationOptions.limit, filterOptions)
            .then(result => {
                const userPaginateDto: UserPaginateDto = {
                    total: result.total as number,
                    pages: result.pages as number,
                    page: result.page,
                    limit: result.limit,
                    nextPage: result.nextPage,
                    prevPage: result.prevPage,
                    docs: result.docs.map(user => this.userDtoPipe.transform(user)),
                };
                return userPaginateDto;
            });
    }

    async create(userDto: UserDto): Promise<any> {
        const validationResult = this.userDtoValidator.validate(userDto, {
            required: ['password', 'role'],
        });

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // assert role existence
        await this.roleService.assertExists(userDto.role as string);

        // create corresponding address and reassign its id to user
        userDto.address = (await this.addressService.create((userDto.address ?? {}) as AddressDto)).id;

        // create corresponding social media links and reassign its id to user
        userDto.socialLinks = (await this.socialLinkService.create((userDto.socialLinks ?? {}) as SocialLinksDto)).id;

        // populate missing user props with default values
        userDto = this.populateMissingValues(userDto);

        return this.userService.create(userDto).then(user => this.userDtoPipe.transform(user));
    }

    details(id: string): Promise<UserDto> {
        return this.userService.findById(id).then(user => {
            if (user) return this.userDtoPipe.transform(user);
            else return Promise.reject(this.errorService.generate(Errors.User.DETAILS_INVALID_REQUEST));
        });
    }

    async update(userDto: UserDto, basicInfoOnly = false): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto);

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        const user = await this.userService.findById(userDto.id);
        if (!user) {
            return Promise.reject(this.errorService.generate(Errors.User.UPDATE_UNKNOWN_ID));
        }

        this.userDtoReversePipe.transformExistent(userDto, user);

        // TODO : do not update if nothing has been modified
        await this.addressService.update(user.address as Address);
        await this.socialLinkService.update(user.socialLinks as SocialLinks);

        return this.userService.update(user).then(user => this.userDtoPipe.transform(user));
    }

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

    async addCertification(userId: string, certificationDto: CertificationDto): Promise<UserDto> {
        //TODO: validate
        const cert = await this.certificationService.create(certificationDto);
        return (await this.userService.attachCertification(userId, cert.id)) as UserDto;
    }

    updateCertification(id: string, certificationDto: CertificationDto): Promise<CertificationDto> {
        //TODO: validate
        return this.certificationService.update(id, certificationDto);
    }

    deleteCertification(id: string): Promise<boolean> {
        return this.certificationService.delete(id);
    }

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

    async addPassport(userId: string, passportDto: PassportDto): Promise<UserDto> {
        //TODO: validate
        const passport = await this.passportService.create(passportDto);
        return this.userService.setPassport(userId, passport.id);
    }

    updatePassport(id: string, passportDto: PassportDto): Promise<PassportDto> {
        //TODO: validate
        return this.passportService.update(id, passportDto);
    }

    deletePassport(id: string) {
        //TODO: validate
        return this.passportService.delete(id);
    }

    async setSkills(userId: string, newSkills: SkillDto[]): Promise<UserDto> {
        //TODO: validate
        const ids = [];
        const promises = [];

        const currentSkills = await this.userService.getSkills(userId);
        currentSkills.forEach(skill => {
            this.skillService.delete(skill.id);
        });

        newSkills.forEach(skillDto => {
            promises.push(this.skillService.create(skillDto).then(skill => ids.push(skill.id)));
        });

        await Promise.all(promises);
        return this.userService.setSkills(userId, ids);
    }

    private populateMissingValues(userDto: UserDto): UserDto {
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

        return userDto;
    }
}

export type UserPaginateDto = NvrPaginateResult<UserDto>;
