import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateTwoFactorTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
