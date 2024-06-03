import { CategoryStatus } from '../enums';

export interface CategoryInterface {
  _id: string;
  name: string;
  status: CategoryStatus;
}
