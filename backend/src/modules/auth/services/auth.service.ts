import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  
    signUp = () => {
        return true;
    }

    signIn = () => {

    }

    verifyEmail() {

    }

    forgotPassword(email: string) {

    }

    resetPassword(token: string, password: string) {
        
    }

}
