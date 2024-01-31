import { requset } from '@/utils/request/index';
import { GetUserDetailResDTO } from './model';

export default {
  getUserDetail() {
    const url = '/user/getUserDetail';
    return requset.get<Nullable<GetUserDetailResDTO>>(url, {});
  },
};
