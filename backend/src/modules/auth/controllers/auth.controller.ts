import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(){
   
  }

  @Post('/login')
  signIn() {

  }

  @Post('/verify-email')
  verifyEmai() {

  }

  @Post('/forgot')
  forgotPassword(@Body() body: { email: string }) {

  }

  @Post('/reset')
  resetPassword(@Body() body: { token: string; password: string }) {

  }

}
