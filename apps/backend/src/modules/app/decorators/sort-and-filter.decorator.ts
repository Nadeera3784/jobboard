import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterQuery, Model, Document } from 'mongoose';

import { SearchOptionEnum } from '../enums/search-option.enum';
import { SortAndFilterConfig } from '../interfaces/sort-and-filter-config.interface';
import { SortAndFilterParams } from '../interfaces/sort-and-filter-params.interface';

export const SortAndFilter = createParamDecorator<SortAndFilterConfig>(
  (config: SortAndFilterConfig, ctx: ExecutionContext): SortAndFilterParams => {
    const request = ctx.switchToHttp().getRequest();

    let sort: { [key: string]: 'asc' | 'desc' } = {};
    if (request.query.sort) {
      request.query.sort
        .split(',')
        .filter((c: string) => {
          if (config.sortable) {
            return (
              config.sortable.includes(c) ||
              (c[0] === '-' && config.sortable.includes(c.slice(1)))
            );
          }
          return c;
        })
        .forEach((sortColumn: string) => {
          let dir: 'asc' | 'desc' = 'asc';
          if (sortColumn[0] === '-') {
            dir = 'desc';
            sortColumn = sortColumn.slice(1);
          }
          sort[sortColumn] = dir;
        });
    }

    let filter: { [key: string]: { value: string; op: SearchOptionEnum } } = {};
    if (request.query.filter) {
      request.query.filter.split(',').forEach((filterColumn: string) => {
        const splits = filterColumn.split(':');
        let key = splits[0];
        const value = splits.slice(1).join(':');

        if (key && value) {
          let op = SearchOptionEnum.EQUALS;
          if (key.indexOf('__') !== -1) {
            const [realKey, stringOp] = key.split('__');
            key = realKey;
            if (
              Object.values(SearchOptionEnum).includes(
                stringOp as SearchOptionEnum,
              )
            ) {
              op = stringOp as SearchOptionEnum;
            }
          }

          if (config.filterable) {
            if (config.filterable.includes(key)) {
              filter[key] = { op, value };
            }
          } else {
            filter[key] = { op, value };
          }
        }
      });
    }

    return { sort, filter };
  },
);

const searchOpToMongooseOperator = {
  [SearchOptionEnum.EQUALS]: '$eq',
  [SearchOptionEnum.NOTEQUALS]: '$ne',
  [SearchOptionEnum.CONTAINS]: '$regex',
  [SearchOptionEnum.ICONTAINS]: '$regex',
  [SearchOptionEnum.GT]: '$gt',
  [SearchOptionEnum.LT]: '$lt',
  [SearchOptionEnum.GTE]: '$gte',
  [SearchOptionEnum.LTE]: '$lte',
  [SearchOptionEnum.STARTSWITH]: '$regex',
  [SearchOptionEnum.ENDSWITH]: '$regex',
};

function paramTransform(param: string, op: SearchOptionEnum) {
  switch (op) {
    case SearchOptionEnum.CONTAINS:
    case SearchOptionEnum.ICONTAINS:
      return new RegExp(
        param,
        op === SearchOptionEnum.ICONTAINS ? 'i' : undefined,
      );
    case SearchOptionEnum.STARTSWITH:
      return new RegExp(`^${param}`, 'i');
    case SearchOptionEnum.ENDSWITH:
      return new RegExp(`${param}$`, 'i');
    default:
      return param;
  }
}

export const sortAndFilterQuery = <T extends Document>(
  params: SortAndFilterParams,
): FilterQuery<T> => {
  const query: any = {};

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      const operator = searchOpToMongooseOperator[value.op] || '$eq';
      if (!query[key]) {
        query[key] = {};
      }
      query[key][operator] = paramTransform(value.value, value.op);
    }
  }

  return query as FilterQuery<T>;
};

export const sortAndFilter = async <T extends Document>(
  model: Model<T>,
  params: SortAndFilterParams,
): Promise<T[]> => {
  const query = sortAndFilterQuery<T>(params);
  const sort = params.sort || {};
  return model.find(query).sort(sort).exec();
};
