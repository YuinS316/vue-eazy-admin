export const enum BUSINESS_ERROR_CODE {
  //  公共的错误
  COMMON = 100000,
  // ===== token和权限相关 =====
  //  没有登录
  USER_NO_LOGIN = 100001,
  //  没有权限
  USER_NO_PREMISSION = 100002,
  //  已过期
  USER_EXPIRED = 100003,

  //  ===== 注册/登录 ======
  //  用户已存在
  USER_EXSIST = 110000,
  //  账号或密码失败
  USER_VALID_FAIL = 110001,
}

export const BUSINESS_ERROR_MESSAGE: {
  [k in BUSINESS_ERROR_CODE]: string;
} = {
  //  公共的错误
  100000: '',
  // ===== token和权限相关 =====
  100001: '用户没有登录',
  100002: '用户没有权限',
  100003: 'token已过期',

  //  ===== 用户注册/登录 ======
  110000: '用户已存在',
  110001: '账号或密码失败',
};
