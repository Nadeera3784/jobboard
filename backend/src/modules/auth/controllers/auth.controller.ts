import { Body, Controller, Param, Post, Res } from '@nestjs/common';

import { SignupDto } from '../dtos/sign-up.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { SignUpFeature } from '../features/sign-up.feature';
import { VerifyEmailFeature } from '../features/verify-email.feature';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpFeature: SignUpFeature,
    private readonly verifyEmailFeature: VerifyEmailFeature,
  ) {}

  @Post('/signup')
  public async signUp(@Res() response, @Body() signupDto: SignupDto) {
    const { status, response: featureUpResponse } =
      await this.signUpFeature.handle(signupDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/login')
  public signIn() {}

  @Post('/verify-email/:token')
  public async verifyEmai(@Res() response, @Param('token') token: string) {
    const { status, response: featureUpResponse } =
      await this.verifyEmailFeature.handle(token);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/forgot')
  public forgotPassword(
    @Res() response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {}

  @Post('/reset')
  public resetPassword(@Body() body: { token: string; password: string }) {}
}
