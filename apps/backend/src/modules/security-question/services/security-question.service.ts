import { BadRequestException, Injectable } from '@nestjs/common';
import { SecurityQuestionEnum } from '../enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityQuestion } from '../schemas';
import { RequestParser, UtilityService } from '../../app/services';
import {
  SecurityQuestionDto,
  SecurityQuestionResponseDto,
  ValidateSecurityQuestionDto,
} from '../dto';
import { Request } from 'express';
import { RequestFingerprint } from '../../app/interfaces/request-fingerprint.interface';

@Injectable()
export class SecurityQuestionService {
  constructor(
    @InjectModel(SecurityQuestion.name)
    private readonly securityQuestionModel: Model<SecurityQuestion>,
  ) {}

  public async getQuestions(): Promise<string[]> {
    return Object.keys(SecurityQuestionEnum).map(
      (key: string) => SecurityQuestionEnum[key],
    );
  }

  public async getRelatedQuestionByUserId(
    userId: string,
  ): Promise<SecurityQuestionResponseDto> {
    const securityQuestionModel: SecurityQuestion =
      await this.findSecurityQuestionByUserId(userId);
    return { question: securityQuestionModel.question };
  }

  public async validate(dto: ValidateSecurityQuestionDto, request: Request) {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    return parsedRequest;
  }

  public async defineSecurityQuestion(dto: SecurityQuestionDto): Promise<void> {
    const answer: string = this.generateHash(dto.answer);
    await this.securityQuestionModel.updateOne(
      {
        userId: dto.userId,
      },
      {
        $set: {
          answer: answer,
          question: dto.question,
          userId: dto.userId,
        },
      },
      { upsert: true },
    );
  }

  public async unDefineSecurityQuestion(userId: string): Promise<void> {
    const securityQuestionModel = await this.findSecurityQuestionByUserId(
      userId,
    );
    if (securityQuestionModel) {
      await this.securityQuestionModel.findOneAndDelete({ userId: userId });
    }
  }

  public async isSecurityQuestionDefined(userId: string): Promise<boolean> {
    const securityQuestionModel = await this.securityQuestionModel.findOne({
      userId: userId,
    });
    return !!securityQuestionModel;
  }

  private async findSecurityQuestionByUserId(
    userId: string,
  ): Promise<SecurityQuestion> {
    const securityQuestionModel = await this.securityQuestionModel.findOne({
      userId: userId,
    });
    if (!securityQuestionModel) {
      throw new BadRequestException(
        `The security question for the userId=${userId} is not defined`,
      );
    }

    return securityQuestionModel;
  }

  private generateHash(answer: string): string {
    return UtilityService.generateHash(answer.toLowerCase());
  }
}
