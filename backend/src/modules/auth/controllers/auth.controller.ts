import { Body, Controller, Param, Post, Res } from '@nestjs/common';

import { SignupDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { SignUpFeature } from '../features/sign-up.feature';
import { SignInFeature } from '../features/sign-in.feature';
import { VerifyEmailFeature } from '../features/verify-email.feature';
import { ForgotPasswordFeature } from '../features/forgot-password.feature';
import { ResetPasswordFeature } from '../features/reset-password.feature';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpFeature: SignUpFeature,
    private readonly verifyEmailFeature: VerifyEmailFeature,
    private readonly forgotPasswordFeature: ForgotPasswordFeature,
    private readonly resetPasswordFeature: ResetPasswordFeature,
    private readonly signInFeature: SignInFeature,
  ) {}

  @Post('/signup')
  public async signUp(@Res() response, @Body() signupDto: SignupDto) {
    const { status, response: featureUpResponse } =
      await this.signUpFeature.handle(signupDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/login')
  public async signIn(@Res() response, @Body() signInDto: SignInDto) {
    const { status, response: featureUpResponse } =
      await this.signInFeature.handle(signInDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/verify-email/:token')
  public async verifyEmai(@Res() response, @Param('token') token: string) {
    const { status, response: featureUpResponse } =
      await this.verifyEmailFeature.handle(token);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/forgot')
  public async forgotPassword(
    @Res() response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.forgotPasswordFeature.handle(forgotPasswordDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/reset/:token')
  public async resetPassword(
    @Res() response,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.resetPasswordFeature.handle(token, resetPasswordDto);
    return response.status(status).json(featureUpResponse);
  }
}
