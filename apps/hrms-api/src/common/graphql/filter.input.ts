import { FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterInput {
    @Field({ nullable: true })
    filterBy?: string;

    @Field({ nullable: true })
    filterValue?: string;
}
