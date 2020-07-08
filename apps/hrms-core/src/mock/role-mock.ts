export const ROLES = {
    managerRole: {
        name: 'manager',
        description: 'Enterprise manager',
        privileges: {
            config: {
                portals: [
                    "role-config",
                ],
                pages: [
                    "role-list",
                    "role-details"
                ],
                actions: [
                    "all-roles.read",

                    "role.create",
                    "role.delete",
                    "role.update",
                    "role.delete"
                ]
            },

            user: {
                portals: [
                    "user-management",
                ],
                pages: [
                    "new-user",
                    "user-list",
                    "user-details",
                    "requests",
                ],
                actions: [
                    "all-users.read",

                    "user.create",
                    "user.read",
                    "user.update",
                    "user.delete",

                    "user.roles.add",
                    "user.roles.read",
                    "user.roles.update",
                    "user.roles.delete",

                    "user.documents.add",
                    "user.documents.read",
                    "user.documents.update",
                    "user.documents.delete",

                    "requests.read",
                    "requests.approve",
                    "requests.refuse",
                ]
            }
        }
    },
    employeeRole: {
        name: 'employee',
        description: 'Enterprise employee',
        privileges: {
            user: {
                portals: [
                    "self-service"
                ],
                pages: [
                    "my-profile"
                ],
                actions: [
                    "my-profile.requests.create",
                    "my-profile.requests.read",
                    "my-profile.requests.update",
                    "my-profile.requests.delete",

                    "my-profile.documents.add",
                    "my-profile.documents.read",
                    "my-profile.documents.update",
                    "my-profile.documents.delete"
                ]
            }
        }
    },
}