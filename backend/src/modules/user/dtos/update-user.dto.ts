import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { KeyValueDTO } from './key-value.dto';

export class UpdateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  email_verified?: Date;

  @MaxLength(10)
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsObject()
  image?: KeyValueDTO

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;
}
