import { Injectable } from '@nestjs/common';

import { AssociativeObject, DataOutcome, GPTResult } from '../interfaces';
import { AIService } from './ai.service';

@Injectable()
export abstract class AIDataOutcomeService extends AIService {
  async handle(input: AssociativeObject): Promise<DataOutcome> {
    const result = await this.getResult(input);

    return this.getOutcomeFromResult(result);
  }

  protected getOutcomeFromResult(
    result: GPTResult | Error | null,
  ): DataOutcome {
    if (result instanceof Error) {
      return {
        data: this.defaultData(),
        metadata: { comment: result.message },
      };
    }

    if (!result) {
      return {
        data: this.defaultData(),
        metadata: { comment: 'No data in response' },
      };
    }

    const { data, notes } = result;
    const comment = (data.comment as string) ?? '';

    return {
      metadata: { data, comment, notes },
      ...this.getDataOutcomeFromResult(result),
    };
  }

  protected defaultData(): unknown {
    return null;
  }

  protected abstract getDataOutcomeFromResult(
    result: GPTResult,
  ): Pick<DataOutcome, 'data'> & Partial<DataOutcome>;
}
