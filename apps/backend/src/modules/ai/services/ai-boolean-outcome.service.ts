import { Injectable } from '@nestjs/common';

import { AssociativeObject, BooleanOutcome, GPTResult } from '../interfaces';
import { AIService } from './ai.service';

@Injectable()
export abstract class GPTBooleanOutcomeService extends AIService {
  async handle(input: AssociativeObject): Promise<BooleanOutcome> {
    const result = await this.getResult(input);

    return this.getOutcomeFromResult(result);
  }

  protected getOutcomeFromResult(
    result: GPTResult | Error | null,
  ): BooleanOutcome {
    if (result instanceof Error) {
      return {
        outcome: false,
        metadata: { comment: result.message },
      };
    }

    if (!result) {
      return {
        outcome: false,
        metadata: { comment: 'No data in response' },
      };
    }

    const { data, notes } = result;
    const comment = (data.comment as string) ?? '';

    return {
      metadata: { data, comment, notes },
      ...this.getBooleanOutcomeFromResult(result),
    };
  }

  protected defaultOutcome(): boolean {
    return false;
  }

  protected abstract getBooleanOutcomeFromResult(
    result: GPTResult,
  ): Pick<BooleanOutcome, 'outcome'> & Partial<BooleanOutcome>;
}
