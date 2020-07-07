import { PipeTransform } from "@nestjs/common";

export interface DtoPipeTransform<SOURCE, TARGET> extends PipeTransform {
    
    transform(value: SOURCE, options: object): TARGET;
    
    canTransform(value: SOURCE): boolean;
}