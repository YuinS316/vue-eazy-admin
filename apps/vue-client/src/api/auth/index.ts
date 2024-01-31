import { requset } from '@/utils/request/index';
import { LoginReqDTO, LoginResDTO } from './model';

export default {
  login(body: LoginReqDTO) {
    const url = '/auth/login';
    return requset.post<LoginResDTO>(url, body);
  },
  logout() {
    const url = '/auth/logout';
    return requset.get(url);
  },
};
