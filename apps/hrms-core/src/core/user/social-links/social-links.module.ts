import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SocialLinks, SocialLinksSchema } from './social-links.schema';
import { SocialLinkService } from './social-links.service';
import { SocialLinksReversePipe } from './social-links-reverse.pipe';

@Module({
    imports: [MongooseModule.forFeature([{ name: SocialLinks.name, schema: SocialLinksSchema }])],
    providers: [SocialLinkService, SocialLinksReversePipe],
    exports: [SocialLinkService, SocialLinksReversePipe],
})
export class SocialLinksModule {}
