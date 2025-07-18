import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { AIService } from '../../ai/services/ai.service';
import { GenerateJobDescriptionDto } from '../dtos';

@Injectable()
export class GenerateJobDescriptionFeature extends Feature {
  constructor(private readonly aiService: AIService) {
    super();
  }

  public async handle(generateJobDescriptionDto: GenerateJobDescriptionDto) {
    try {
      const { jobTitle, additionalInfo } = generateJobDescriptionDto;
      
      const description = await this.aiService.generateJobDescription(
        jobTitle, 
        additionalInfo
      );

      return this.responseSuccess(
        HttpStatus.OK,
        'Job description generated successfully',
        { description }
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Failed to generate job description. Please try again later.',
        error,
      );
    }
  }
} 