import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(6, 20, {
    message: `用户名长度必须大于$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: `密码长度必须大于$constraint1到$constraint2之间` })
  password: string;
}
