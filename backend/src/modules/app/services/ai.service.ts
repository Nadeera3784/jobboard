import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {

  private generativeAI: GoogleGenerativeAI;
  private generativeModel: GenerativeModel;

  constructor(private configService: ConfigService) {
      this.generativeAI = new GoogleGenerativeAI(configService.get('ai.google_generative_key'));
      this.generativeModel = this.generativeAI.getGenerativeModel({ model: "gemini-pro" });
  }

  public async getKeywordSuggestion() {}

  public async magicWriter() {}

  public async jobMatcher(job: string, resume: string){
    const prompt = `Match The Following Job Description:\n\n${job}\n\nWith Candidate Resume:\n\n${resume} then return the percentage`;
    const result = await this.generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
