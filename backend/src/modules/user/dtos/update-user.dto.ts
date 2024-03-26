import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  name: string;

  @IsEmail()
  @IsString()
  @IsOptional()
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
