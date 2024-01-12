export interface LoginForm {
  userName: string;
  password: string;
  captcha: string;
}

export type LoginInfo = Pick<LoginForm, 'userName' | 'password'>;
