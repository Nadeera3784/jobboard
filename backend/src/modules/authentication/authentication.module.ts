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
import { PasswordResetTokenService } from './services/password-reset-token.service';
import {
  ResetPasswordFeature,
  SignInFeature,
  MeFeature,
  VerifyEmailFeature,
  SignUpFeature,
  ForgotPasswordFeature,
} from './features';
import { UserUpdatedListener } from '../user/listeners/user-updated.listener';
import { AppModule } from '../app/app.module';
import { BruteForceModule } from '../brute-force/brute-force.module';

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
    BruteForceModule
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
