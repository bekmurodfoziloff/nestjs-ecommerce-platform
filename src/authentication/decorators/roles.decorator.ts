import { SetMetadata } from '@nestjs/common';
import { Role } from '../../utils/enums/role.enum';
import { RolesKey } from '../../utils/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);
