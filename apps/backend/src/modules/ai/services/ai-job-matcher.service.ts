import { Injectable } from '@nestjs/common';

import { AssociativeObject, DataOutcome, GPTResult } from '../interfaces';
import { AIDataOutcomeService } from './ai-data-outcome.service';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';

@Injectable()
export class AIJobMatcherService extends AIDataOutcomeService {
  protected getDataOutcomeFromResult(
    result: GPTResult,
  ): Pick<DataOutcome, 'data'> & Partial<DataOutcome> {
    return {
      data: result.data,
    };
  }

  //TODO:needs to improve this.
  protected systemMessage(_input: AssociativeObject): string {
    return `The job that the applicant is applying to is delimited by <job>.
        The resume is delimited by <resume>.

        compare job descrption and resume. 

        return match as a percentage.

       - Enclose all answers for this step with <output></output>.
        `;
  }

  protected userMessage(input: AssociativeObject): string {
    const job = input.job;
    const resume = input.resume;
    return [
      this.openAIService.delimitText(JSON.stringify(job), 'job'),
      this.openAIService.delimitText(JSON.stringify(resume), 'resume'),
    ].join('\n\n');
  }

  protected chatCompletionOptions(): Partial<ChatCompletionCreateParamsNonStreaming> {
    return {
      max_tokens: 1024,
      n: 1,
      top_p: 0.5,
    };
  }

  protected shouldConfirmResult(
    _result: GPTResult,
    _input: AssociativeObject,
  ): boolean {
    return false;
  }

  protected confirmMessage(_input: AssociativeObject): string {
    return `Are you sure that the percentage is correct?
- Ensure that the job texts are sourced directly from the provided job.
- Enclose all answers for this step with <note></note>.

Return the new output.
- Enclose all answers for this step with <output></output>.`;
  }
}
