import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { SocialLinksDto } from '@hrms-core/dto/social-links.dto';
import { Injectable } from '@nestjs/common';
import { SocialLinks } from './social-links.schema';

@Injectable()
export class SocialLinksReversePipe implements DtoTransformPipe<SocialLinksDto, SocialLinks> {
    transform(source: SocialLinksDto, options?: object): SocialLinks {
        return null;
    }

    transformExistent(dto: SocialLinksDto, model: SocialLinks, options?: object): SocialLinks {
        model.linkedIn = dto.linkedIn ?? model.linkedIn;
        model.whatsApp = dto.whatsApp ?? model.whatsApp;
        model.facebook = dto.facebook ?? model.facebook;
        model.github = dto.github ?? model.github;
        model.stackOverflow = dto.stackOverflow ?? model.stackOverflow;

        return model;
    }

    canTransform(value: SocialLinksDto): boolean {
        return true;
    }
}
