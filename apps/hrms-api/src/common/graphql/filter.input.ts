import { FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FilterInput implements Partial<FilterOptions> {}
