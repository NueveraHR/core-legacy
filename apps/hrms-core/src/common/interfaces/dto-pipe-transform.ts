import { PipeTransform } from "@nestjs/common";

export interface DtoTransformPipe<SOURCE, TARGET> extends PipeTransform {

    transform(source: SOURCE, options?: object): TARGET;

    transformExistent(source: SOURCE, target: TARGET, options?: object): TARGET;

    canTransform(value: SOURCE): boolean;
}