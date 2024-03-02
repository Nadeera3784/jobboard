import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

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
  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 8, {
    message: 'Password must be between 6 and 8 characters',
  })
  password: string;
}
