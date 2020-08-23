export enum GeneralErrors {
    INTERNAL_ERROR = 500,
}

export enum LoginErrors {
    INVALID_REQUEST = 41000,
    NO_EMAIL = 41100,
    INVALID_EMAIL = 41101,
    NO_PASSWORD = 41102,
    INVALID_CREDENTIALS = 41200,
}

export enum UserErrors {
    CREATE_INVALID_REQUEST = 42000,
    CREATE_DUPLICATED = 42010,
    LIST_INVALID_REQUEST = 42001,
    DETAILS_INVALID_REQUEST = 42002,
    UPDATE_UNKNOWN_ID = 42003,

    NO_DATA = 42100,
    MISSING_ID = 42101,
    MISSING_USERNAME = 42102,
    MISSING_FIRSTNAME = 42103,
    MISSING_LASTNAME = 42104,
    MISSING_PASSWORD = 42105,
    MISSING_EMAIL = 42106,
    INVALID_EMAIL = 42107,
    MISSING_CIN = 42108,
    MISSING_PREFIX = 42109,
    MISSING_ROLE = 42110,
    MISSING_GENDER = 42111,
    MISSING_PHONE = 42112,
    INVALID_CIN = 42115,

    INVALID_ROLE_ID = 42200,
    UNKNOWN_ROLE = 42201,
    CANNOT_UPDATE_DETAILS = 42202,
    INVALID_USER_ID = 42203,
}

export enum RoleErrors {
    CREATE_INVALID_REQUEST = 43000,
    CREATE_DUPLICATED = 43010,
    LIST_INVALID_REQUEST = 43001,
    DETAILS_INVALID_REQUEST = 43002,
    UPDATE_INVALID_REQUEST = 43003,
    DELETE_INVALID_ID = 43004,

    NO_DATA = 43100,
    MISSING_NAME = 43101,
    MISSING_DESCRIPTION = 43102,
    MISSING_PRIVILEGES = 43103,
    MISSING_ROLE = 43104,
    MISSING_ID = 43105,

    UNKNOWN_ROLE_ID = 43200,
    UNKNOWN_ROLE = 43201,
}

export enum JobErrors {
    CREATE_INVALID_REQUEST = 44000,
    LIST_INVALID_REQUEST = 44001,
    UPDATE_INVALID_REQUEST = 44002,
    DELETE_INVALID_ID = 44003,

    NO_DATA = 44100,
    MISSING_TITLE = 44101,
    MISSING_STARTDATE = 44102,
    MISSING_LOCATION = 44103,
    MISSING_SUPERVISOR = 44104,
    MISSING_DEPARTEMENT = 44105,
    MISSING_ID = 44106,

    UNKNOWN_JOB_ID = 44200,
    UNKNOWN_JOB = 44201,
}
