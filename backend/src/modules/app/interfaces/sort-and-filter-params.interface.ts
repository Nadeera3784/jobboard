import { SearchOptionEnum } from '../enums/search-option.enum';

export interface SortAndFilterParams {
  sort?: { [key: string]: 'asc' | 'desc' };
  filter?: { [key: string]: { value: string; op: SearchOptionEnum } };
}
