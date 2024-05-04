import { SetMetadata } from '@nestjs/common';

import { RolesEnum } from '../../user/enums';

export const RolesAllowed = (...roles: RolesEnum[]) =>
  SetMetadata('roles', roles);
