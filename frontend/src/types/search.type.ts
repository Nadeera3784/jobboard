export type Filters = {
  category: string;
  location: string;
  remote: string;
  job_type: string;
  experience_level: string;
};

export type SearchPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  startPage: number;
  endPage: number;
  totalCount: number;
  limit: number;
};
