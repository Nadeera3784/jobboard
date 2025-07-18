import { Injectable } from '@nestjs/common';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import OpenAI from 'openai';

import configuration from '../../../config/configuration';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    const config = configuration();
    this.openai = new OpenAI({
      apiKey: config.ai.openai_api_key,
    });
  }

  public async generateJobDescription(
    jobTitle: string,
    additionalInfo?: string,
  ): Promise<string> {
    try {
      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: `You are a professional HR expert and job description writer. Create comprehensive, engaging, and professional job descriptions that attract top talent. Focus on clarity, specificity, and inclusivity.`,
      };

      const userPrompt = `Create a detailed job description for the position: "${jobTitle}"
      
      ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}
      
      Please include the following sections:
      1. Job Overview (2-3 sentences)
      2. Key Responsibilities (5-7 bullet points)
      3. Required Qualifications (4-6 bullet points)
      4. Preferred Qualifications (3-4 bullet points)
      5. What We Offer (3-4 bullet points about benefits/company culture)
      
      Make it professional, engaging, and specific to the role. Use clear, inclusive language and avoid jargon.`;

      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: userPrompt,
      };

      const params: ChatCompletionCreateParamsNonStreaming = {
        model: configuration().ai.model.gpt4_0,
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 1500,
      };

      const completion = await this.openai.chat.completions.create(params);

      return (
        completion.choices[0]?.message?.content ||
        'Failed to generate job description'
      );
    } catch (error) {
      console.error('Error generating job description:', error);
      throw new Error('Failed to generate job description');
    }
  }

  public async polishJobDescrption() {}
}
