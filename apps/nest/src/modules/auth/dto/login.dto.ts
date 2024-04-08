import { IsString, Length } from 'class-validator';

export class LoginReqDTO {
  @IsString({ message: '用户名必填' })
  @Length(6, 20, {
    message: `用户名长度必须是$constraint1到$constraint2之间`,
  })
  userName: string;

  @IsString({ message: '密码必填' })
  @Length(6, 20, {
    message: `密码长度必须是$constraint1到$constraint2之间`,
  })
  password: string;

  // @IsString({ message: '验证码必填' })
  // captcha: string;
}
