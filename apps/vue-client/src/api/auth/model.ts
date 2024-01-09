export interface LoginReqDTO {
  userName: string;
  password: string;
  captcha: string;
}

export type LoginResDTO = string;
