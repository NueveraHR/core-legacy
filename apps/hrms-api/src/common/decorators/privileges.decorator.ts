import { SetMetadata } from '@nestjs/common';

export const Privileges = (...privileges: string[]) => SetMetadata('privileges', privileges);

export const IgnorePrivileges = () => SetMetadata('ignorePrivileges', true);
