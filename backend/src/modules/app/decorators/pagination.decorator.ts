import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { URL } from 'url';

export interface PaginateParams {
  page?: number;
  pageSize?: number;
  baseUrl: string;
  query: any;
  paginator: new (params: PaginateParams) => Paginator;
}

export interface PaginateConfig {
  maxPageSize?: number;
  defaultPageSize?: number;
  paginator?: new (params: PaginateParams) => Paginator;
}

export interface Paginated<T> {
  results: T[];
  meta: {
    pageCount: number;
    count: number;
    page: number;
    pageSize: number;
  };
  links: {
    first: string;
    next: string;
    prev: string;
    last: string;
  };
}

export const Pagination = createParamDecorator<PaginateConfig>(
  (config: PaginateConfig, ctx: ExecutionContext): PaginateParams => {
    const request = ctx.switchToHttp().getRequest();
    const baseUrl = `${request.protocol}://${request.get('host')}${
      request.baseUrl
    }${request.path}`;
    const paginator = config.paginator || PagedPaginator;

    let pageSize =
      parseInt(request.query.pageSize) || config.defaultPageSize || 10;
    if (config.maxPageSize) {
      pageSize = Math.min(pageSize, config.maxPageSize);
    }

    return {
      page: parseInt(request.query.page) || 1,
      pageSize,
      baseUrl,
      query: request.query,
      paginator,
    };
  },
);

export abstract class Paginator {
  protected params: PaginateParams;

  constructor(params: PaginateParams) {
    this.params = params;
  }

  abstract paginate<Entity extends Document>(
    model: Model<Entity>,
  ): Promise<Paginated<Entity>>;
  abstract paginateQuery<Entity extends Document>(
    model: Model<Entity>,
    filter: any,
  ): Promise<Paginated<Entity>>;
}

export class PagedPaginator extends Paginator {
  private page: number;
  private pageSize: number;
  private pageCount: number;
  private count: number;

  constructor(params: PaginateParams) {
    super(params);
    this.pageSize = this.params.pageSize;
    this.page = this.params.page;
  }

  async paginate<Entity extends Document>(model: Model<Entity>) {
    const skip = (this.page - 1) * this.pageSize;

    const [results, count] = await Promise.all([
      model.find().skip(skip).limit(this.pageSize).exec(),
      model.countDocuments().exec(),
    ]);

    this.count = count;
    this.pageCount = Math.floor((count - 1) / this.pageSize) + 1;
    if (count === 0) {
      this.pageCount = 0;
    }

    const links = this.links();
    const meta = this.meta();

    return {
      results,
      meta,
      links,
    };
  }

  async paginateQuery<Entity extends Document>(
    model: Model<Entity>,
    filter: any,
  ) {
    const skip = (this.page - 1) * this.pageSize;

    const [results, count] = await Promise.all([
      model.find(filter).skip(skip).limit(this.pageSize).exec(),
      model.countDocuments(filter).exec(),
    ]);

    this.count = count;
    this.pageCount = Math.floor((count - 1) / this.pageSize) + 1;
    if (count === 0) {
      this.pageCount = 0;
    }

    const links = this.links();
    const meta = this.meta();

    return {
      results,
      meta,
      links,
    };
  }

  private links() {
    function _addOriginalQueryParams(url: URL, query: any) {
      for (const [k, v] of Object.entries(query)) {
        url.searchParams.set(k, v.toString());
      }
    }

    const first = new URL(this.params.baseUrl);
    _addOriginalQueryParams(first, this.params.query);
    first.searchParams.set('page', '1');
    first.searchParams.set('pageSize', this.pageSize.toString());

    const last = new URL(this.params.baseUrl);
    _addOriginalQueryParams(last, this.params.query);
    last.searchParams.set('page', Math.max(this.pageCount, 1).toString());
    last.searchParams.set('pageSize', this.pageSize.toString());

    let prev = null;
    if (this.page > 1) {
      prev = new URL(this.params.baseUrl);
      _addOriginalQueryParams(prev, this.params.query);
      prev.searchParams.set('page', (this.page - 1).toString());
      prev.searchParams.set('pageSize', this.pageSize.toString());
      prev = prev.toString();
    }

    let next = null;
    if (this.page < this.pageCount) {
      next = new URL(this.params.baseUrl);
      _addOriginalQueryParams(next, this.params.query);
      next.searchParams.set('page', (this.page + 1).toString());
      next.searchParams.set('pageSize', this.pageSize.toString());
      next = next.toString();
    }

    return {
      first: first.toString(),
      next: next,
      prev: prev,
      last: last.toString(),
    };
  }

  private meta() {
    return {
      pageCount: this.pageCount,
      pageSize: this.pageSize,
      page: this.page,
      count: this.count,
    };
  }
}

export const paginate = async <T extends Document>(
  model: Model<T>,
  params: PaginateParams,
  filter: any = {},
): Promise<Paginated<T>> => {
  const paginator = new params.paginator(params);
  return await paginator.paginateQuery(model, filter);
};
