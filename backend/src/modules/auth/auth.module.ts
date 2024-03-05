import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import {
  PasswordResetTokenSchema,
  PasswordResetToken,
} from './schemas/passwordResetToken.schema';
import {
  VerificationTokenSchema,
  VerificationToken,
} from './schemas/verificationToken.schema';
import { UserModule } from '../user/user.module';
import { UserRegisterdListener } from './listeners/user-registerd.listener';
import { ResetPasswordListener } from './listeners/reset-password.listener';
import { VerificationMailQueue } from './queues/verification-email.queue';
import { PasswordResetMailQueue } from './queues/password-reset-email.queue';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { EmailService } from '../util/services/email.service';
import { VerificationTokenService } from './services/verification-token.service';
import { VerifyEmailFeature } from '../auth/features/verify-email.feature';
import { PasswordResetTokenService } from './services/password-reset-token.service';
import { ForgotPasswordFeature } from '../auth/features/forgot-password.feature';
import { SignUpFeature } from '../auth/features/sign-up.feature';
import { ResetPasswordFeature } from '../auth/features/reset-password.feature';
import { SignInFeature } from '../auth/features/sign-in.feature';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: VerificationToken.name, schema: VerificationTokenSchema },
    ]),
    BullModule.registerQueue(
      {
        name: 'verification-email',
      },
      {
        name: 'reset-password-email',
      },
    ),
    UserModule,
  ],
  providers: [
    AuthService,
    VerificationTokenService,
    EmailService,
    SignUpFeature,
    VerificationMailQueue,
    UserRegisterdListener,
    VerifyEmailFeature,
    PasswordResetTokenService,
    ForgotPasswordFeature,
    ResetPasswordListener,
    PasswordResetMailQueue,
    ResetPasswordFeature,
    SignInFeature,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
