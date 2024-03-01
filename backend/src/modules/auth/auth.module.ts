import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordResetTokenSchema, passwordResetToken } from './schemas/passwordResetToken.schema';
import { VerificationTokenSchema, VerificationToken } from './schemas/verificationToken.schema';
import { UserModule } from '../user/user.module';
import { SignUpFeature } from '../auth/features/sign-up.feature';
import { UserRegisterdListener } from '../auth/listeners/user-registerd.listener';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: passwordResetToken.name, schema: PasswordResetTokenSchema},
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
    SignUpFeature,
    UserRegisterdListener
  ],
  controllers: [AuthController],
})

export class AuthModule {}
