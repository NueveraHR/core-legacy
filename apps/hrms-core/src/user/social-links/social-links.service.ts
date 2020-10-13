import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocialLinks } from './social-links.schema';
import { SocialLinksDto } from '@hrms-core/user/social-links/social-links.dto';

@Injectable()
export class SocialLinkService {
    constructor(@InjectModel(SocialLinks.name) private readonly socialLinksModel: Model<SocialLinks>) {}

    create(links: SocialLinksDto): Promise<SocialLinks> {
        return this.socialLinksModel.create(links);
    }

    update(linksModel: SocialLinks): Promise<SocialLinks> {
        return linksModel.save();
    }
}
