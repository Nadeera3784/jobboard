import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsPasswordNotPwned, IsPasswordStrong } from '../constraints';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password must be between 6 and 20 characters',
  })
  @MaxLength(32)
  @IsPasswordStrong()
  @IsPasswordNotPwned()
  password: string;

  @MaxLength(10)
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role: string;
}
