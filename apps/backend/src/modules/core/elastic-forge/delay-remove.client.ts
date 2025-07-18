import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from './elastic-search.client';

@Injectable()
export class DelayRemoveClient {
  private retries = 0;
  private maxRetries = 10;
  private timeout = 1000;

  constructor(
    private readonly client: ElasticSearchClient,
    private readonly logger: Logger,
  ) {}

  async deleteByQuery(index: string, type: string, search: any): Promise<void> {
    this.retries++;
    const deleted = await this.client.deleteByQuery(index, search);

    if (!deleted && this.retries < this.maxRetries) {
      this.logger.log({
        context: 'DelayRemoveClient',
        index: index,
        message: 'Delaying new cycle.',
        query: search,
        attempt: this.retries,
      });

      setTimeout(() => {
        this.deleteByQuery(index, type, search).catch();
      }, this.timeout);
    }
  }
}
