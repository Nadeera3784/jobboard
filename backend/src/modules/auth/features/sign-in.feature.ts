import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { SignInDto } from '../dtos';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { AuthService } from '../services/auth.service';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';
import { Events } from '../../user/enums/events.enum';
import { VerificationTokenService } from '../services';

@Injectable()
export class SignInFeature extends BaseFeature {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly verificationTokenService: VerificationTokenService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(signInDto: SignInDto) {
    try {
      const existingUser = await this.userService.getByEmail(signInDto.email);

      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'There is no user associated with this email',
        );
      }

      if (!existingUser.email_verified) {
        await this.dispatchEvent(existingUser.email);
      }

      const isPasswordMatch = await this.authService.signIn(
        signInDto.password,
        existingUser.password,
      );

      if (isPasswordMatch) {
        const payload = {
          id: existingUser._id,
        };

        const accessToken = this.jwtService.sign(payload);

        return this.responseSuccess(
          HttpStatus.OK,
          ResponseType.SUCCESS,
          'Login successfully',
          {
            type: 'Bearer',
            accessToken: accessToken,
          },
        );
      }

      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Invalid credentials',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async dispatchEvent(email: string) {
    const event = new UserRegisterdEvent();
    const verificationToken =
      await this.verificationTokenService.generateVerificationToken(email);
    event.token = verificationToken.token;
    event.email = verificationToken.email;
    this.eventEmitter.emit(Events.USER_REGISTERED, event);
  }
}
