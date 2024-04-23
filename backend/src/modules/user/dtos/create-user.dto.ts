import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';

import { KeyValueDTO } from './key-value.dto';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(10)
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsObject()
  image?: KeyValueDTO

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
