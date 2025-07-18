import { ApiResponse } from '@elastic/elasticsearch';

export interface SearchResultBodyDto<
  T = {
    [key: string]: any;
  },
  A = never,
> {
  hits: {
    hits: Array<SearchResultItemDto<T>>;
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
  };
  aggregations?: {
    [key: string]: {
      buckets: A[];
    };
  };
  timed_out: false;
  took: number;
}

export interface SearchResultItemDto<T> {
  _id: string;
  _index: string;
  _score: number;
  _type: string;
  _source: T;
}

export type SearchResultDto<
  T = {
    [key: string]: any;
  },
  A = never,
> = ApiResponse<SearchResultBodyDto<T, A>>;
