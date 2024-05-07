import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import {
  BlockList,
  BlockListSchema,
  LoginAttempt,
  LoginAttemptSchema,
  RegisterAttempt,
  RegisterAttemptSchema,
  SecurityQuestionAttempt,
  SecurityQuestionAttemptSchema,
} from './schemas';
import {
  BlockListService,
  LoginAttemptService,
  RegisterAttemptService,
  SecurityQuestionService,
  SuspiciousActivityService,
} from './services';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { UserLoginListener } from './listeners/user-login.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LoginAttempt.name,
        schema: LoginAttemptSchema,
      },
      {
        name: BlockList.name,
        schema: BlockListSchema,
      },
      {
        name: RegisterAttempt.name,
        schema: RegisterAttemptSchema,
      },
      {
        name: SecurityQuestionAttempt.name,
        schema: SecurityQuestionAttemptSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UserModule,
  ],
  providers: [
    SecurityQuestionService,
    SuspiciousActivityService,
    LoginAttemptService,
    RegisterAttemptService,
    BlockListService,
    ConfigService,
    UserLoginListener,
  ],
  exports: [SuspiciousActivityService],
})
export class BruteForceModule {}
