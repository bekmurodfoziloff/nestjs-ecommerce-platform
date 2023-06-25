import { ProductsPermission } from './enums/productsPermission.enum';
import { CategoriesPermission } from './enums/categoriesPermission.enum';
import { DiscountsPermission } from './enums/discountsPermission.enum';
import { OrdersPermission } from './enums/ordersPermission.enum';
const Permission = {
  ...ProductsPermission,
  ...CategoriesPermission,
  ...DiscountsPermission,
  ...OrdersPermission
};

type Permission = ProductsPermission | CategoriesPermission | DiscountsPermission | OrdersPermission;

export default Permission;

export const PermissionsKey = 'Permissions';
