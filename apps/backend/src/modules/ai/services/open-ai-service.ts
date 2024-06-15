import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Chat, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenAIService {
  constructor(private openai: OpenAI) {}

  async chatCompletion(
    model: string,
    messages: ChatCompletionMessageParam[],
    options: Partial<ChatCompletionCreateParamsNonStreaming> = {},
  ): Promise<Chat.Completions.ChatCompletion.Choice[]> {
    const completion = await this.openai.chat.completions.create({
      messages,
      model,
      temperature: 1,
      top_p: 0.2,
      ...options,
    });

    return completion.choices;
  }

  delimitText(text: string, delimiter: string) {
    return `<${delimiter}>${text}</${delimiter}>`;
  }
}
