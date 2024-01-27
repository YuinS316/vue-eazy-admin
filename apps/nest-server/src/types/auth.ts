export interface JwtPayload {
  //  数据库id
  id: number;
  //  用户名
  userName: string;
  //  当前权限
  currentRoleCode: string;
  //  权限列表
  roleCodeList: string[];
}
