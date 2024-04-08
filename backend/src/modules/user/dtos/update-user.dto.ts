import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsString()
  image?: string;

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
