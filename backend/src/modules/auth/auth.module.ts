import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
import { EmailService } from '../app/services';
import { VerificationTokenService } from './services/verification-token.service';
import { VerifyEmailFeature } from '../auth/features/verify-email.feature';
import { PasswordResetTokenService } from './services/password-reset-token.service';
import { ForgotPasswordFeature } from '../auth/features/forgot-password.feature';
import { SignUpFeature } from '../auth/features/sign-up.feature';
import { ResetPasswordFeature } from '../auth/features/reset-password.feature';
import { SignInFeature } from '../auth/features/sign-in.feature';
import { MeFeature } from './features/me.feature';
import { UserUpdatedListener } from '../user/listeners/user-updated.listener';

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
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('app.jwt_key'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
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
    ForgotPasswordFeature,
    ResetPasswordListener,
    PasswordResetMailQueue,
    ResetPasswordFeature,
    SignInFeature,
    MeFeature,
    UserUpdatedListener,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
