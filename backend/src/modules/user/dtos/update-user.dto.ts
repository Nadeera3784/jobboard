import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
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
  @Length(6, 8, {
    message: 'Password must be between 6 and 8 characters',
  })
  password: string;
}
