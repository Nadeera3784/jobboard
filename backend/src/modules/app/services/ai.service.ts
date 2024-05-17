import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Textract } from 'aws-sdk';

@Injectable()
export class AiService {
  private generativeAI: GoogleGenerativeAI;
  private generativeModel: GenerativeModel;

  constructor(private configService: ConfigService) {
    this.generativeAI = new GoogleGenerativeAI(
      configService.get('ai.google_generative_key'),
    );
    this.generativeModel = this.generativeAI.getGenerativeModel({
      model: 'gemini-pro',
    });
  }

  public async getKeywordSuggestion() {}

  public async magicWriter() {}

  public async jobMatcher(job: string, resume: string) {
    const prompt = `Match The Following Job Description:\n\n${job}\n\nWith Candidate Resume:\n\n${resume} then return the percentage`;
    const result = await this.generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  public async pdfToJson(fileName: string) {
    const textract = new Textract({
      region: this.configService.get('ilesystem.disks.s3.region'),
      endpoint: `https://textract.${this.configService.get(
        'ilesystem.disks.s3.region',
      )}.amazonaws.com/`,
      accessKeyId: this.configService.get('filesystem.disks.s3.key'),
      secretAccessKey: this.configService.get('filesystem.disks.s3.secret'),
    });

    const options = {
      Document: {
        S3Object: {
          Bucket: this.configService.get('filesystem.disks.s3.bucket'),
          Name: fileName,
        },
      },
      FeatureTypes: ['FORMS'],
    };

    textract.analyzeDocument(options, (err, data) => {});
  }
}
