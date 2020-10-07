import { Skill, SkillSchema } from './skill.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillService } from './skill.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }])],
    providers: [SkillService],
    exports: [SkillService],
})
export class SkillModule {}
