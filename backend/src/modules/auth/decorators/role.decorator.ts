import { SetMetadata } from '@nestjs/common';

import { Roles } from '../../user/enums/roles.enum';

export const RolesAllowed = (...roles: Roles[]) => SetMetadata('roles', roles);
