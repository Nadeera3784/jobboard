import { User } from '../../../modules/user/schemas';

export class SendVerificationCodeEvent {
  code: number;
  user: User;
}
