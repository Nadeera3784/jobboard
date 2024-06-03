import { Module } from '@nestjs/common';
import { SecurityQuestionService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityQuestion, SecurityQuestionSchema } from './schemas';
import { SecurityQuestionController } from './controllers';

@Module({
  controllers: [SecurityQuestionController],
  exports: [SecurityQuestionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: SecurityQuestion.name,
        schema: SecurityQuestionSchema,
      },
    ]),
  ],
  providers: [SecurityQuestionService],
})
export class SecurityQuestionModule {}
