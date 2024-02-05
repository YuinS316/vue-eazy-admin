import { requset } from '@/utils/request/index';
import { CreateNewMenuReqDTO, GetMenuPermissionResDTO } from './model';

export default {
  getMenuPermission(name: string) {
    const url = '/permission/getMenuPermission';
    return requset.get<GetMenuPermissionResDTO>(url, {
      name,
    });
  },
  createNewMenu(data: CreateNewMenuReqDTO) {
    const url = `/permission`;
    return requset.post<boolean>(url, data);
  },
  deletePermission(id: number) {
    const url = `/permission/${id}`;
    return requset.delete(url);
  },
};
