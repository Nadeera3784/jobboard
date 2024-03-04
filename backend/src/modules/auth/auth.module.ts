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
import { SignUpFeature } from '../auth/features/sign-up.feature';
import { UserRegisterdListener } from './listeners/user-registerd.listener';
import { VerificationTokenService } from './services/verification-token.service';
import { VerificationMailQueue } from './queues/verification-email.queue';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { EmailService } from '../util/services/email.service';
import { VerifyEmailFeature } from '../auth/features/verify-email.feature';
import { PasswordResetTokenService } from './services/password-reset-token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: VerificationToken.name, schema: VerificationTokenSchema },
    ]),
    BullModule.registerQueue({
      name: 'verification-email',
    }),
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
  ],
  controllers: [AuthController],
})
export class AuthModule {}
