import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { PasswordResetTokenSchema, passwordResetToken } from './schemas/passwordResetToken.schema';
import { VerificationTokenSchema, VerificationToken } from './schemas/verificationToken.schema';
import { UserModule } from '../user/user.module';
import { SignUpFeature } from '../auth/features/sign-up.feature';
import { UserRegisterdListener } from './listeners/user-registerd.listener';
import { TokenService } from './services/token.service';
import { VerificationMailQueue } from './queues/verification-email.queue';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { EmailService } from '../util/services/email.service';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: passwordResetToken.name, schema: PasswordResetTokenSchema },
      { name: VerificationToken.name, schema: VerificationTokenSchema },
    ]),
    BullModule.registerQueue(
      {
        name: 'verification-email',
      },
    ),
    UserModule
  ],
  providers: [
    AuthService,
    TokenService,
    EmailService,
    SignUpFeature,
    VerificationMailQueue,
    UserRegisterdListener,
  ],
  controllers: [AuthController],
})

export class AuthModule { }
