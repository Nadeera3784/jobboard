import { Client, ApiResponse } from '@elastic/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';
import { SearchResultBodyDto } from './dto';
import { ElasticSearchConfig } from './elastic-search.config';
import { ElasticFieldConfigInterface, ESSearchBody } from './interfaces';

@Injectable()
export class ElasticSearchClient {
  private client: Client;

  constructor(
    private readonly logger: Logger,
    private readonly config: ElasticSearchConfig,
  ) {
    const clientOptions: any = {
      maxRetries: 10,
      requestTimeout: 60000,
      suggestCompression: true,
    };

    if (this.config.cloudId) {
      clientOptions.cloud = {
        id: this.config.cloudId,
        password: this.config.authPassword,
        username: this.config.authUsername,
      };
    } else {
      clientOptions.node = this.config.host;
    }

    if (this.config.authUsername && this.config.authPassword) {
      clientOptions.auth = {
        password: this.config.authPassword,
        username: this.config.authUsername,
      };
    }

    this.client = new Client(clientOptions);
  }

  async addAlias(index: string, alias: string): Promise<void> {
    await this.client.indices.putAlias({ index, name: alias });
  }

  async removeAlias(index: string, aliases: string[]): Promise<void> {
    await this.client.indices.deleteAlias({ index, name: aliases });
  }

  async getAlias(index: string): Promise<any> {
    const response = await this.client.indices.getAlias({ index });
    return response.body;
  }

  async isAliasExists(index: string, alias: string): Promise<boolean> {
    const response = await this.client.indices.existsAlias({
      index,
      name: alias,
    });
    return response.body;
  }

  async refresh(index: string): Promise<void> {
    await this.client.indices.refresh({ index: index });
  }

  async singleIndex(
    index: string,
    record: any,
    logSuccess = true,
  ): Promise<void> {
    const bulkBody = [];
    const doc = Object.assign({}, record);
    doc.mongoId = doc._id;
    delete doc._id;

    bulkBody.push({
      update: {
        _id: doc.mongoId,
        _index: index,
      },
    });

    bulkBody.push({
      doc: doc,
      doc_as_upsert: true,
    });

    try {
      const response = await this.client.bulk({
        body: bulkBody,
        refresh: 'wait_for',
      });

      if (response.body.errors) {
        const item = response.body.items.shift();
        if (item.update && item.update.error) {
          this.logger.error({
            context: 'ElasticSearchClient',
            message: 'Error on ElasticSearch bulk request',
            response: {
              error: item.update.error,
              index: item.update.index,
              itemId: item.update._id,
              result: item.update.result,
            },
          });
        }
      } else {
        if (logSuccess) {
          this.logger.log({
            context: 'ElasticSearchClient',
            itemId: record._id,
            message: 'Successfully indexed item',
          });
        }
      }
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        item: record._id,
        message: 'Error on ElasticSearch bulk request',
      });
      throw e;
    }
  }

  async bulkIndex(
    index: string,
    records: any[],
    routing: any = null,
  ): Promise<void> {
    const bulkBody = [];

    for (const record of records) {
      const doc = Object.assign({}, record);
      const itemId = doc._id;
      doc.mongoId = doc._id;
      delete doc._id;

      bulkBody.push({
        update: {
          _id: itemId,
          _index: index,
        },
      });

      bulkBody.push({
        doc: doc,
        doc_as_upsert: true,
      });
    }

    if (!bulkBody.length) {
      return;
    }

    try {
      const response = await this.client.bulk({
        body: bulkBody,
        refresh: 'wait_for',
        routing: routing || undefined,
      });

      let errorCount = 0;
      if (response.body.errors) {
        for (const item of response.body.items) {
          if (item.update && item.update.error) {
            this.logger.error({
              context: 'ElasticSearchClient',
              message: 'Error on ElasticSearch bulkIndex request',
              response: {
                error: item.update.error,
                index: item.update.index,
                itemId: item.update._id,
                result: item.update.result,
              },
            });
          }
          errorCount++;
        }
      }

      this.logger.log({
        context: 'ElasticSearchClient',
        message:
          `Successfully indexed ${response.body.items.length - errorCount} ` +
          `out of ${response.body.items.length} items`,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch bulkIndex request',
      });
      throw e;
    }
  }

  async rename(oldIndex: string, newIndex: string): Promise<void> {
    const callback = async () => {
      await this.refresh(newIndex);
      await this.drop(oldIndex);
    };

    await this.reIndex(oldIndex, newIndex, callback);
  }

  async drop(index: string): Promise<void> {
    try {
      const response = await this.client.indices.delete({
        index: index,
      });

      if (response.body.errors) {
        const item = response.body.items.shift();
        if (item.update && item.update.error) {
          this.logger.error({
            context: 'ElasticSearchClient',
            message: 'Error on ElasticSearch drop request',
            response: {
              error: item.update.error,
              index: item.update.index,
              itemId: item.update._id,
              result: item.update.result,
            },
          });
        }
      } else {
        this.logger.log({
          context: 'ElasticSearchClient',
          message: 'Successfully drop',
        });
      }
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch drop request',
      });
      throw e;
    }
  }

  async reIndex(
    oldIndex: string,
    newIndex: string,
    callback: () => Promise<void>,
  ): Promise<void> {
    try {
      const response = await this.client.reindex({
        body: {
          dest: {
            index: newIndex,
          },
          source: {
            index: oldIndex,
          },
        },
      });

      if (response.body.errors) {
        const item = response.body.items.shift();
        if (item.update && item.update.error) {
          this.logger.error({
            context: 'ElasticSearchClient',
            message: 'Error on ElasticSearch reindex request',
            response: {
              error: item.update.error,
              index: item.update.index,
              itemId: item.update._id,
              result: item.update.result,
            },
          });
        }
      } else {
        this.logger.log({
          context: 'ElasticSearchClient',
          message: 'Successfully reindex',
        });
        await callback();
      }
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch reindex request',
      });
      throw e;
    }
  }

  async search<T = { [key: string]: any }>(
    index: string,
    search: ESSearchBody,
  ): Promise<ApiResponse<SearchResultBodyDto<T>>> {
    try {
      return await this.client.search({
        body: search,
        index: index,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch search request',
        request: search,
      });
      throw e;
    }
  }

  async count(
    index: string,
    search: ESSearchBody,
  ): Promise<ApiResponse<Record<string, any>, unknown>> {
    try {
      return await this.client.count({
        body: search,
        index: index,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch count request',
        request: search,
      });
      throw e;
    }
  }

  async deleteByQuery(index: string, search: any): Promise<number> {
    try {
      const response = await this.client.deleteByQuery({
        body: search,
        index: index,
        conflicts: 'proceed',
        refresh: true,
        wait_for_completion: true,
      });

      this.logger.log({
        context: 'ElasticSearchClient',
        index: index,
        message: 'Result of ElasticSearch deleteByQuery request',
        query: search,
        rawResponse: response.body,
        result: {
          deleted: response.body.deleted,
          total: response.body.total,
        },
      });

      return response.body.deleted;
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch deleteByQuery request',
        request: search,
      });
      throw e;
    }
  }

  async createIndex(index: string): Promise<any> {
    try {
      return await this.client.indices.create({
        index: index,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        indexName: index,
        message: 'Error on ElasticSearch createIndex request',
      });
      throw e;
    }
  }

  async closeIndex(index: string): Promise<void> {
    try {
      await this.client.indices.close({ index: index });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch close request',
      });
      throw e;
    }
  }

  async openIndex(index: string): Promise<void> {
    try {
      await this.client.indices.open({ index: index });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch open request',
      });
      throw e;
    }
  }

  async putIndexSettings(index: string, body: any): Promise<any> {
    try {
      return await this.client.indices.putSettings({
        body: body,
        index: index,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        indexName: index,
        message: 'Error on ElasticSearch putIndexSettings request',
      });
      throw e;
    }
  }

  async isIndexExists(index: string): Promise<boolean> {
    try {
      const response = await this.client.indices.exists({
        index: index,
      });
      return response.body;
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch isIndexExists request',
      });
      throw e;
    }
  }

  async setupFieldMapping(
    index: string,
    field: string,
    config: ElasticFieldConfigInterface,
  ): Promise<void> {
    try {
      const response = await this.client.indices.putMapping({
        include_type_name: true,
        index: index,
        type: index,
        body: {
          properties: {
            [field]: config,
          },
        },
      });

      this.logger.log({
        context: 'ElasticSearchClient',
        field: field,
        index: index,
        response: response,
      });
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch setupFieldMapping request',
      });
      throw e;
    }
  }

  async updateByQuery(index: string, updateQuery: any): Promise<number> {
    try {
      const response = await this.client.updateByQuery({
        body: updateQuery,
        index: index,
        conflicts: 'proceed',
        refresh: true,
        wait_for_completion: true,
      });

      return response.body.updated;
    } catch (e) {
      this.logger.error({
        context: 'ElasticSearchClient',
        error: e.message,
        message: 'Error on ElasticSearch updateByQuery request',
        request: updateQuery,
      });
      throw e;
    }
  }
}
