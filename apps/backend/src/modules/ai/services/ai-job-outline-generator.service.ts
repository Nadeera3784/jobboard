import { Injectable } from '@nestjs/common';
import { AssociativeObject, DataOutcome, GPTResult } from '../interfaces';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import { AIDataOutcomeService } from './ai-data-outcome.service';

@Injectable()
export class AIJobOutLineGeneratorService extends AIDataOutcomeService {
  protected getDataOutcomeFromResult(result: GPTResult): Pick<DataOutcome, 'data'> & Partial<DataOutcome> {
    return {
      data: result.data,
    };
  }

  protected systemMessage(_input: AssociativeObject): string {
        return `The job descrption delimited by <job_descrption>
              As an experienced resume reviewer, your task is to analyze and refine the provided job description.
              
              Please follow these steps.

              1.Carefully read and parse the job description enclosed within the <job_description> tags.
               - Enclose all answers for this step with <note></note>.

              2. Identify the key elements of the job, including, Role title and primary responsibilities,  Required qualifications and skills,  Desired experience,  Any unique aspects or benefits of the position
               - Enclose all answers for this step with <note></note>.

              3. Rewrite the job description in a more professional and polished manner, ensuring to Use clear, concise language,  Organize information logically, Highlight the most important aspects of the role,  Remove any unnecessary or redundant information,  Incorporate industry-standard terminology where appropriate
               - Enclose all answers for this step with <note></note>.

              4.Format the refined job description for easy readability, using appropriate headings, bullet points, and paragraphs as needed.
               - Enclose all answers for this step with <note></note>.
               
              5.Review your work to ensure all crucial information from the original description is retained and accurately represented in the refined version.
               - Enclose all answers for this step with <note></note>.

            - Enclose all answers for this step with <output></output>
           `
        ;
  }

  protected userMessage(input: AssociativeObject): string {
    const job_descrption = input.job_descrption;

    return [
      this.openAIService.delimitText(JSON.stringify(job_descrption), 'job_descrption'),
    ].join('\n\n');
  }

  protected chatCompletionOptions(): Partial<ChatCompletionCreateParamsNonStreaming> {
    return {
      max_tokens: 1024,
      n: 1,
      top_p: 0.5,
    };
  }

  protected shouldConfirmResult(_result: GPTResult, _input: AssociativeObject): boolean {
    return false;
  }

  protected confirmMessage(_input: AssociativeObject): string {
    return `Are you sure that the extracted job_descrption are correct and capture all relevant job_descrption?
- Ensure that the job_descrption texts are sourced directly from the provided job_descrption.
- Check grammer issues.
- Justify your answer.
- Enclose all answers for this step with <note></note>.

Return the new output.
- Enclose all answers for this step with <output></output>.`;
  }
}
