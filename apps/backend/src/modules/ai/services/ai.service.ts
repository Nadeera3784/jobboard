import { Injectable } from '@nestjs/common';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';

import { AssociativeObject, GPTResult, Outcome } from '../interfaces';
import { OpenAIService } from './open-ai.service';
import configuration from '../../../config/configuration';

@Injectable()
export abstract class AIService {
  constructor(protected openAIService: OpenAIService) {}

  async handle(input: AssociativeObject): Promise<Outcome> {
    const result = await this.getResult(input);

    return this.getOutcomeFromResult(result);
  }

  protected async getResult(
    input: AssociativeObject,
  ): Promise<GPTResult | Error> {
    try {
      const promptMessages = this.promptMessages(input);

      const contents = await this.requestOpenAI(promptMessages);

      let result = this.pickBestGPTResult(contents, input);

      if (this.shouldConfirmResult(result, input)) {
        const confirmPromptMessages = this.confirmPromptMessages(
          promptMessages,
          result,
          input,
        );

        const contents = await this.requestOpenAI(confirmPromptMessages);

        const confirmResult = this.pickBestGPTResult(contents, input);

        result = this.combineGPTResults(result, confirmResult);
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  protected promptMessages(
    input: AssociativeObject,
  ): ChatCompletionMessageParam[] {
    return [
      {
        role: 'system',
        content: this.systemMessage(input),
      },
      {
        role: 'user',
        content: this.userMessage(input),
      },
    ];
  }

  protected abstract systemMessage(input: AssociativeObject): string;

  protected abstract userMessage(input: AssociativeObject): string;

  protected abstract shouldConfirmResult(
    result: GPTResult,
    input: AssociativeObject,
  ): boolean;

  protected confirmPromptMessages(
    promptMessages: ChatCompletionMessageParam[],
    result: GPTResult,
    input: AssociativeObject,
  ): ChatCompletionMessageParam[] {
    return [
      ...promptMessages,
      {
        role: 'assistant',
        content: result.content,
      },
      {
        role: 'user',
        content: this.confirmMessage(input),
      },
    ];
  }

  protected abstract confirmMessage(input: AssociativeObject): string;

  protected async requestOpenAI(messages: ChatCompletionMessageParam[]) {
    const options = this.chatCompletionOptions();

    const response = await this.openAIService.chatCompletion(
      this.chatCompletionModel(),
      messages,
      options,
    );

    return response.map((val) =>
      this.parseContentToObject(val?.message?.content),
    );
  }

  protected chatCompletionOptions(): Partial<ChatCompletionCreateParamsNonStreaming> {
    return {
      max_tokens: 1024,
      n: 1, // Only 1 completion response
      top_p: 0.2, // Less randomness
    };
  }

  protected chatCompletionModel(): string {
    return configuration().ai.model.gpt;
  }

  protected parseContentToObject(content: string): GPTResult {
    try {
      const jsonIndex = content.indexOf('<output>');
      const jsonString = content
        .substring(jsonIndex + 8, content.lastIndexOf('</output>'))
        .replace(/\n/g, '');
      const data = JSON.parse(jsonString) as AssociativeObject;

      const notes = content
        .substring(0, jsonIndex)
        .replace(/<\/note>\n+<note>/g, '\n')
        .replace(/\n+/g, '\n');

      return {
        data,
        notes,
        content,
      };
    } catch (error) {
      console.log('Error converting OpenAI response to JSON', error as Error);
      return { data: {}, notes: content, content };
    }
  }

  protected pickBestGPTResult(
    results: GPTResult[],
    metadata: AssociativeObject,
  ): GPTResult {
    if (results.length === 0) {
      throw new Error('Empty results');
    }

    if (results.length === 1) {
      return results[0];
    }

    const sortedResults = this.sortGPTResults(results, metadata);
    const filteredResults = this.filterGPTResults(sortedResults, metadata);

    return filteredResults.shift();
  }

  protected filterGPTResults(
    results: GPTResult[],
    metadata: AssociativeObject,
  ): GPTResult[] {
    return results;
  }

  protected sortGPTResults(
    results: GPTResult[],
    metadata: AssociativeObject,
  ): GPTResult[] {
    return results;
  }

  protected combineGPTResults(
    result1: GPTResult,
    result2: GPTResult,
  ): GPTResult {
    const data1 = result1.data;
    const data1comment = (data1.comment as string) ?? '';

    const data2 = result2.data;
    const data2comment = (data2.comment as string) ?? '';

    const notes1 = result1.notes;
    const notes2 = result2.notes;

    return {
      ...result1,
      ...result2,
      data: {
        ...data1,
        ...data2,
        comment: data1comment + data2comment,
      },
      notes: notes1 + notes2,
    };
  }

  protected abstract getOutcomeFromResult(
    result: GPTResult | Error | null,
  ): Outcome;
}
