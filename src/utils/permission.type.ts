import { ProductsPermission } from './enums/productsPermission.enum';
import { CategoriesPermission } from './enums/categoriesPermission.enum';
import { DiscountsPermission } from './enums/discountsPermission.enum';
const Permission = {
  ...ProductsPermission,
  ...CategoriesPermission,
  ...DiscountsPermission
};

type Permission = ProductsPermission | CategoriesPermission | DiscountsPermission;

export default Permission;

export const PermissionsKey = 'Permissions';
