import { ProductsPermission } from './enums/productsPermission.enum';
import { CategoriesPermission } from './enums/categoriesPermission.enum';
const Permission = {
  ...ProductsPermission,
  ...CategoriesPermission
};

type Permission = ProductsPermission | CategoriesPermission;

export default Permission;

export const PermissionsKey = 'Permissions';
