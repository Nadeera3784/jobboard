import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecondFactorController } from './controllers/second-factor.controller';
import { SecondFactorService, CodeNumberGeneratorService } from './services';
import { ValidateSecondFactorCodeFeature } from './features';
import { VerificationCodeListener } from './listeners';
import { EventDispatcherModule } from '../core/event-dispatcher';
import { MongooseModule } from '@nestjs/mongoose';
import { SecondFactor, SecondFactorTokenSchema } from './schemas';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BullModule } from '@nestjs/bull';
import { SecondFactorVerificationMailQueue } from './queues';
import { BruteForceModule } from '../brute-force/brute-force.module';
import { AppModule } from '../app/app.module';

@Module({
  imports: [
    EventDispatcherModule,
    MongooseModule.forFeature([
      {
        name: SecondFactor.name,
        schema: SecondFactorTokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('app.jwt_key'),
        signOptions: { expiresIn: configService.get('app.jwt_expires_in') },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'second-factor-verification-email',
    }),
    UserModule,
    BruteForceModule,
    forwardRef(() => AppModule),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [
    SecondFactorService,
    CodeNumberGeneratorService,
    SecondFactorVerificationMailQueue,
    ValidateSecondFactorCodeFeature,
    VerificationCodeListener,
  ],
  controllers: [SecondFactorController],
  exports: [
    SecondFactorService,
    CodeNumberGeneratorService,
    ValidateSecondFactorCodeFeature,
  ],
})
export class SecondFactorModule implements NestModule {
  public configure(): MiddlewareConsumer | void {}
}
