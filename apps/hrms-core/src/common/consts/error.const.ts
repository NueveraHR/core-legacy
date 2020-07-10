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

    //---------------------------------- User (42xxx) ---------------------------------- 

    // Controller invalid request(420xx)
    42000: 'Invalid request, Cannot creat user',
    42001: 'Invalid request, Cannot get list of users',
    42002: 'Invalid request, Cannot get user details',
    42003: 'Invalid request, Cannot update user details',
    42004: 'Invalid request, Cannot update user details',

    // Validator invalid data (421xx)
    42100: 'No user data provided!',
    42101: 'Invalid user : Missing user identifier!',
    42102: 'Invalid user : Missing username!',
    42103: 'Invalid user : Missing first name!',
    42104: 'Invalid user : Missing last name!',
    42105: 'Invalid user : Missing password!',
    42106: 'Invalid user : Missing email!',
    42107: 'Invalid user : invalid email provided',
    42108: 'Invalid user : Missing cin!',
    42109: 'Invalid user : Missing prefix!',
    42110: 'Invalid user : Missing role!',
    42111: 'Invalid user : Missing gender!',
    42112: 'Invalid user : Missing phone!',
    42113: 'Invalid user : Missing mode of employment!',
    42114: 'Invalid user : Missing department!',

    // Facade error (422xx)
    42200: 'Unknown role given',


    //---------------------------------- Role (43xxx) ---------------------------------- 

    // Controller invalid request(430xx)
    43000: 'Invalid request, Cannot creat Role',
    43001: 'Invalid request, Cannot get list of roles',
    43002: 'Invalid request, Cannot get role details',
    43003: 'Invalid request, Cannot update role details',
    43004: 'Invalid request, Cannot delete',

    // Validator invalid data (431xx)
    43100: 'No role data provided!',
    43101: 'Invalid role : Missing role name!',
    43102: 'Invalid role : Missing role description!',
    43103: 'Invalid role : Missing set of privileges!',
    43104: 'Invalid role : Missing role identifier!',


    // Facade error (432xx)

}

export interface ErrorCodeMessage {
    [code: number]: string;
}