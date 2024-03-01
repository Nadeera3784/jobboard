import { BadRequestException, Body, Controller, Get, HttpStatus, Inject, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from '../dtos/sign-up.dto';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { SignUpFeature } from '../features/sign-up.feature';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly signUpFeature: SignUpFeature
  ) { }

  @Post('/signup')
  public async signUp(@Res() response, @Body() signupDto: SignupDto) {
    const { status, response: signUpResponse } = await this.signUpFeature.handle(signupDto);
    return response.status(status).json(signUpResponse);
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
