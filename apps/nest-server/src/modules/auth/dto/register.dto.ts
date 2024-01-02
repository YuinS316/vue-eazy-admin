import { IsString, Length } from 'class-validator';

//  注册
export class RegisterReqDTO {
  @IsString()
  @Length(6, 20, {
    message: `用户名长度必须是$constraint1到$constraint2之间`,
  })
  userName: string;

  @IsString()
  @Length(6, 20, {
    message: `密码长度必须是$constraint1到$constraint2之间`,
  })
  password: string;
}

//  登录
export class LoginReqDTO {}

export class LoginResDTO {}
