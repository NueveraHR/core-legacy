export class ErrorDto {
    constructor(
        public message: string,
        public code?: number,
        public detailedMessage?: string,
    ) {

    }
}