export const enum BUSINESS_ERROR_CODE {
  //  公共的错误
  COMMON = 100000,
  // ===== token和权限相关 =====
  //  没有登录
  USER_NO_LOGIN,
  //  没有权限
  USER_NO_PREMISSION,
  //  已过期
  USER_EXPIRED,

  USER_NOT_EXIST,

  TOKEN_INVALID,
  TOKEN_EXPIRED,

  //  ===== 注册/登录 ======
  //  用户已存在
  USER_EXIST = 110000,
  //  账号或密码
  USER_VALID_FAIL,
  //  验证码错误（或者机器人登录，导致session没有携带验证码）
  CAPTCHA_FAIL,

  //  ====== 角色相关 ======
  //  角色已存在
  ROLE_EXIST = 120000,

  ROLE_NOT_EXIST,

  //  ====== 权限资源相关 ======
  PERMISSION_EXIST = 130000,
  PERMISSION_NOT_EXIST,
}

export const BUSINESS_ERROR_MESSAGE: {
  [k in BUSINESS_ERROR_CODE]: string;
} = {
  //  公共的错误
  100000: '',
  // ===== token和权限相关 =====
  100001: '用户没有登录',
  100002: '用户没有权限',
  100003: '用户已过期',
  100004: '用户不存在',
  100005: 'token不合法',
  100006: 'token已过期',

  //  ===== 用户注册/登录 ======
  110000: '用户已存在',
  110001: '账号或密码错误',
  110002: '验证码错误',

  //  ====== 角色相关 ======
  120000: '角色已存在',
  120001: '角色不存在',

  //  ====== 权限资源相关 ======
  130000: '权限已存在',
  130001: '权限不存在',
};
