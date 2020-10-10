import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SocialLinks, SocialLinksSchema } from './social-links.schema';
import { SocialLinkService } from './social-links.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: SocialLinks.name, schema: SocialLinksSchema }])],
    providers: [SocialLinkService],
    exports: [SocialLinkService],
})
export class SocialLinksModule {}
