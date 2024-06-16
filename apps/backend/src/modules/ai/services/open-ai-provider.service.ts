import { Provider } from '@nestjs/common';
import OpenAI from 'openai';

import configuration from '../../../config/configuration';

export const OpenAIProviderService: Provider = {
  provide: OpenAI,
  useFactory: async () => {
    const openai = new OpenAI({
      apiKey: configuration().ai.openai_api_key,
    });

    return openai;
  },
};
