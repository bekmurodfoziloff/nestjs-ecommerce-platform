import { SetMetadata } from '@nestjs/common';
import { Role } from '../../utils/role.enum';
import { RolesKey } from '../../utils/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);
