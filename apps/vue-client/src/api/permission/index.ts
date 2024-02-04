import { requset } from '@/utils/request/index';
import { GetMenuPermissionResDTO } from './model';

export default {
  getMenuPermission() {
    const url = '/permission/getMenuPermission';
    return requset.get<GetMenuPermissionResDTO>(url, {});
  },
};
