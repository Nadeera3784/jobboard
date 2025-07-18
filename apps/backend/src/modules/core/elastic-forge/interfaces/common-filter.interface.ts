import { FilterFieldTypeEnum, FilterFieldCondition } from '../enums';

/**
 * @description Copied from nest-kit to prevent circular dependencies
 */
export interface CommonFilterInterface {
  field: string;
  fieldType: FilterFieldTypeEnum;
  fieldCondition: FilterFieldCondition;
  value: any;
  filters?: CommonFilterInterface[];
  valueIn?: string[];
}
