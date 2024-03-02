import { IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class CreateVerificationTokenDto {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    token: string;
  
    @IsNotEmpty()
    expires: Date;

}
