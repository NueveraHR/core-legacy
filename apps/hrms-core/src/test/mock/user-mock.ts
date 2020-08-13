export const USERS = {
    basicUser: {
        username: 'nuevera',
        email: 'n@nuevera.com',
        cin: '12345678',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    },
    basicUserDuplicatedEmail: {
        username: 'nuevera2',
        email: 'n@nuevera.com',
        cin: '12345678',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    },
    userWithInvalidEmail: {
        email: 'test',
        password: '0000'
    },
    userWithoutEmail: {
        email: '',
        password: '0000'
    },
    userWithoutPassword: {
        email: 'n@nuevera.com',
        password: ''
    },
    employeeRole: {
        name: 'employee',
        description: 'Enterprise employee',
        privileges:[
            'shared.requests.access',
            'shared.requests.create',
            'shared.requests.cancel',
            'shared.requests.approve',
            'shared.requests.reject',

            'shared.notifications.access',

            'config.roles.access',
            'config.roles.create', 
            'config.roles.edit',
            'config.roles.delete',

            'user.record.access',
            'user.record.create',
            'user.record.edit',
            'user.record.delete',

            'user.profile.access',
            'user.profile.edit',
        ]
    }
};