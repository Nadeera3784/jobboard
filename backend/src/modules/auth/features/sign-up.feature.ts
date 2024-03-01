import { Injectable, BadRequestException, HttpStatus} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignupDto } from '../dtos/sign-up.dto';
import { UserRegisterdEvent } from '../events/user-registerd.event';

@Injectable()
export class SignUpFeature {

  constructor(
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2
  ) {}

  public async handle(signupDto: SignupDto) {
    try {
      const isRegistered = await this.authService.signUp(signupDto);
      if (isRegistered instanceof BadRequestException) {
        return {
          status: HttpStatus.BAD_REQUEST,
          response: {
            type: ResponseType.ERROR,
            message: isRegistered.message,
            data: null,
          },
        };
      }
      this.publishEvents(isRegistered);
      return {
        status: HttpStatus.OK,
        response: {
          type: ResponseType.SUCCESS,
          message: 'User has been created successfully',
          data: null,
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: {
          type: ResponseType.ERROR,
          message: 'Something went wrong, Please try again later',
          data: error,
        },
      };
    }
  }

  private publishEvents = (user) => {
    const userRegisterdEvent = new UserRegisterdEvent();
    userRegisterdEvent.name = user.name;
    userRegisterdEvent.email = user.email;
    this.eventEmitter.emit('user.registerd', UserRegisterdEvent);
  }
  
}