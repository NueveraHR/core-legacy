import { FilterOptions, SortType } from '@hrms-core/common/interfaces/pagination';
import { InputType, registerEnumType, Field } from '@nestjs/graphql';

registerEnumType(SortType, {
    name: 'SortType',
});

@InputType()
export class SortInput implements Partial<FilterOptions> {
    @Field()
    sortBy: string;

    @Field(() => SortType)
    sortType: SortType;
}
