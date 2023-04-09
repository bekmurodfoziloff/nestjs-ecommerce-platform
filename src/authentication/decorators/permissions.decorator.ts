import { SetMetadata } from '@nestjs/common';
import Permission from '../../utils/permission.type';
import { PermissionsKey } from '../../utils/permission.type';

export const Permissions = (...permissions: Permission[]) => SetMetadata(PermissionsKey, permissions);
