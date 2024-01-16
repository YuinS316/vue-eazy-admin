import { requset } from '@/utils/request/index';
import { GetRoleByCodeResDTO } from './model';

export default {
  getRoleByCode(code: string) {
    const url = '/role/queryMenuByRole';
    return requset.get<GetRoleByCodeResDTO>(url, { code });
  },
};
