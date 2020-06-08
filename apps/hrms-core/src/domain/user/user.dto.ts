export class userDTO {
    constructor(
        public username: string,
        public prefix?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public role?: string,
        public dateOfJoining?: string,
        public dateOfLeaving?: string,
        public yearsOfExperience?: string,
        public employmentStatus?: string,
        public gender?: string,
        public phone?: number,
        public modeOfEmployment?: string,
        public department?: string,
        public password?: string,
        public firstVisit?: boolean,
        public priveleges?: string,
    ) { }

}