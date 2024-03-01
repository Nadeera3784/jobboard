import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SignupDto } from '../dtos/sign-up.dto';
import { UserService } from '../../user/services/user.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        @InjectQueue('verification-email') private verificationEmailQueue: Queue,
    ) {
    }


    public async signUp(signupDto: SignupDto) {
        try {
            return await this.userService.create(signupDto);
        } catch (error) {
            return error;
        }
    }

    public signIn = () => {

    }

    public verifyEmail() {

    }

    public forgotPassword(email: string) {

    }

    public resetPassword(token: string, password: string) {
        
    }

    public async sendVerificationMail(payload) {
        await this.verificationEmailQueue.add('send-verification-email', payload, {
          attempts: 3,
        });
    }

}
