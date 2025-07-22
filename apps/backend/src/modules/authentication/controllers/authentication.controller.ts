import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import {
  ResetPasswordDto,
  ForgotPasswordDto,
  SignInDto,
  SignupDto,
} from '../dtos';

import {
  MeFeature,
  ResetPasswordFeature,
  ForgotPasswordFeature,
  VerifyEmailFeature,
  SignInFeature,
  SignUpFeature,
} from '../features';
import { AuthenticationGuard } from '../guards/authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly signUpFeature: SignUpFeature,
    private readonly verifyEmailFeature: VerifyEmailFeature,
    private readonly forgotPasswordFeature: ForgotPasswordFeature,
    private readonly resetPasswordFeature: ResetPasswordFeature,
    private readonly signInFeature: SignInFeature,
    private readonly meFeature: MeFeature,
  ) {}

  @Post('/signup')
  @Header('Content-Type', 'application/json')
  public async signUp(@Res() response: Response, @Body() signupDto: SignupDto) {
    const { status, response: featureUpResponse } =
      await this.signUpFeature.handle(signupDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/signin')
  @Header('Content-Type', 'application/json')
  public async signIn(
    @Res() response: Response,
    @Req() request: Request,
    @Body() signInDto: SignInDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.signInFeature.handle(request, signInDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/verify-email/:token')
  @Header('Content-Type', 'application/json')
  public async verifyEmai(
    @Res() response: Response,
    @Param('token') token: string,
  ) {
    const { status, response: featureUpResponse } =
      await this.verifyEmailFeature.handle(token);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/forgot')
  @Header('Content-Type', 'application/json')
  public async forgotPassword(
    @Res() response: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.forgotPasswordFeature.handle(forgotPasswordDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/reset/:token')
  @Header('Content-Type', 'application/json')
  public async resetPassword(
    @Res() response: Response,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.resetPasswordFeature.handle(token, resetPasswordDto);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/me')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard)
  public async me(@Req() request, @Res() response: Response) {
    const { status, response: featureUpResponse } = await this.meFeature.handle(
      request.user.id,
    );
    return response.status(status).json(featureUpResponse);
  }
}
