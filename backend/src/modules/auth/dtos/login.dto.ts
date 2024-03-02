import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;
}
