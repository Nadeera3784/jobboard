import { User } from '../../user/schemas/user.schema';
import { SignInDto } from '../dtos';
import { RequestFingerprint } from '../../app/interfaces/request-fingerprint.interface';

export class UserLoginEvent {
  user?: User;
  parsedRequest: RequestFingerprint;
  signInDto: SignInDto;
  isValidPassword: boolean;
}
