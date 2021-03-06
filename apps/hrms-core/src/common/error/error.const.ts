import {
    LoginErrors,
    GeneralErrors,
    UserErrors,
    RoleErrors,
    JobErrors,
    PassportErrors,
} from './error.enum';

export const ErrorMessage: ErrorCodeMessage = {
    500: 'Internal Server Error, Please Contact Your System Administrator',
    50000: 'Internal Server Error, Please Contact Your System Administrator',

    //---------------------------------- Authentication (41xxx) ----------------------------------

    // Controller invalid request(410xx)
    41000: 'Invalid request, Cannot continue login',

    // Validator invalid data (411xx)
    41100: 'No email address provided!',
    41101: 'Invalid email provided!',
    41102: 'No password provided!',

    // Facade error (412xx)
    41200: 'Invalid login credentials',
    41201: 'This account has not been activated, Check your email or contact support team',
    //---------------------------------- User (42xxx) ----------------------------------

    // Controller invalid request(420xx)
    42000: 'Invalid request, Cannot creat user',
    42010: 'Cannot creat user, a user with similar username or email already exists!',
    42001: 'Invalid request, Cannot find list of users',
    42002: 'Invalid request, Cannot find user details',
    42003: 'Invalid request, Cannot update user details with unknown id',
    42004: 'Invalid password!',
    42005: 'Attempted to update password for inactive account',

    // Validator invalid data (421xx)
    42100: 'No user data provided!',
    42101: 'Invalid user : Missing user identifier!',
    42102: 'Invalid user : Missing username!',
    42103: 'Invalid user : Missing first name!',
    42104: 'Invalid user : Missing last name!',
    42105: 'Invalid user : Missing password!',
    42106: 'Invalid user : Missing email!',
    42107: 'Invalid user : invalid email provided',
    42108: 'Invalid user : Missing CIN!',
    42109: 'Invalid user : Missing prefix!',
    42110: 'Invalid user : Missing role!',
    42111: 'Invalid user : Missing gender!',
    42112: 'Invalid user : Missing phone!',
    42113: 'Invalid user : Missing mode of employment!',
    42114: 'Invalid user : Missing department!',
    42115: 'Invalid user : CIN must be 8 digits long!',

    // Facade error (422xx)
    42200: 'Invalid role id',
    42201: 'Unknown role',
    42202: 'Cannot update user details',
    42203: 'Invalid user id',

    42204: 'Cannot activate account with invalid token',
    42205: 'Cannot restore account with invalid token',
    //---------------------------------- Role (43xxx) ----------------------------------

    // Controller invalid request(430xx)
    43000: 'Invalid request, Cannot creat Role',
    43010: 'Role with similar name already exists!',

    43001: 'Invalid request, Cannot find list of roles',
    43002: 'Invalid request, Cannot find role details',
    43003: 'Invalid request, Cannot update role details with invalid id',
    43004: 'Invalid request, Cannot delete role with invalid id',

    // Validator invalid data (431xx)
    43100: 'No role data provided!',
    43101: 'Invalid role : Missing role name!',
    43102: 'Invalid role : Missing role description!',
    43103: 'Invalid role : Missing set of privileges!',
    43104: 'Invalid role : Missing role identifier!',

    // Facade error (432xx)
    43200: 'Cannot delete role, Unknown role id',
    43201: 'Unknown role',

    //---------------------------------- Job (44xxx) ----------------------------------

    // Controller invalid request(440xx)
    44000: 'Invalid request, Cannot creat Job',
    44001: 'Invalid request, Cannot find list of jobs',
    44002: 'Invalid request, Cannot update job',
    44003: 'Invalid request, Cannot delete role with invalid id',

    // Validator invalid data (441xx)
    44100: 'No data provided!',
    44101: 'Invalid job : Missing job title!',
    44102: 'Invalid job : Missing job startDate!',
    44103: 'Invalid job : Missing job location!',
    44104: 'Invalid job : Missing job supervisor!',
    44105: 'Invalid job : Missing job department!',

    // Facade error (432xx)
    44200: 'Cannot delete job, Unknown job id',
    44201: 'Unknown job',

    //---------------------------------- Passport (45xxx) ----------------------------------
    // Controller invalid request(420xx)
    45001: 'A passport with same number already exists',
};

export const Errors = {
    General: GeneralErrors,
    Login: LoginErrors,
    Role: RoleErrors,
    User: UserErrors,
    Job: JobErrors,
    Passport: PassportErrors,
};

export interface ErrorCodeMessage {
    [code: number]: string;
}
