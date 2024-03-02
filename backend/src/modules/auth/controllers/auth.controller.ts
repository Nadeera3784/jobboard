import { Body, Controller, Post, Res } from '@nestjs/common';

import { SignupDto } from '../dtos/sign-up.dto';
import { SignUpFeature } from '../features/sign-up.feature';

@Controller('auth')
export class AuthController {
  constructor(private readonly signUpFeature: SignUpFeature) {}

  @Post('/signup')
  public async signUp(@Res() response, @Body() signupDto: SignupDto) {
    const { status, response: signUpResponse } =
      await this.signUpFeature.handle(signupDto);
    return response.status(status).json(signUpResponse);
  }

  @Post('/login')
  public signIn() {}

  @Post('/verify-email')
  public verifyEmai() {}

  @Post('/forgot')
  public forgotPassword(@Body() body: { email: string }) {}

  @Post('/reset')
  public resetPassword(@Body() body: { token: string; password: string }) {}
}
