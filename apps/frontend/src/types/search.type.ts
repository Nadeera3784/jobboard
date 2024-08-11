export type FilterOption = {
  _id: string;
  name: string;
};

export type Filters = {
  category: FilterOption | null;
  location: FilterOption | null;
  remote: FilterOption | null;
  job_type: FilterOption | null;
  experience_level: FilterOption | null;
};

export type SearchPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  startPage: number;
  endPage: number;
  totalCount: number;
  limit: number;
};
