import { Module, forwardRef } from '@nestjs/common';
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
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { VerificationTokenService } from './services/verification-token.service';
import { VerifyEmailFeature } from './features/verify-email.feature';
import { PasswordResetTokenService } from './services/password-reset-token.service';
import { ForgotPasswordFeature } from './features/forgot-password.feature';
import { SignUpFeature } from './features/sign-up.feature';
import { ResetPasswordFeature } from './features/reset-password.feature';
import { SignInFeature } from './features/sign-in.feature';
import { MeFeature } from './features/me.feature';
import { UserUpdatedListener } from '../user/listeners/user-updated.listener';
import { AppModule } from '../app/app.module';

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
    forwardRef(() => AppModule),
    UserModule,
  ],
  providers: [
    AuthenticationService,
    VerificationTokenService,
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
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
