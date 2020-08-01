export const ROLES = {
    managerRole: {
        name: 'manager',
        description: 'Enterprise manager',
        privileges: [
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
    },
    employeeRole: {
        name: 'employee',
        description: 'Enterprise employee',
        privileges: [
            'shared.requests.access',
            'shared.requests.create',
            'shared.requests.cancel',
            
            'shared.notifications.access',

            'user.profile.access',
            'user.profile.edit',
        ],
    },
}