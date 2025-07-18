export type ColumnProps = {
  name: string;
  label: string;
  type: string;
  orderable: boolean;
  visible: boolean;
  width?: string;
};

export type ActionButton = {
  label: string;
  type: string;
  orderable: boolean;
  visible: boolean;
};

export type TableProps = {
  endpoint: string;
  per_page: number;
  columns: ColumnProps[];
  filters: FilterProps[];
  has_row_buttons: boolean;
  has_multiselect: boolean;
  refresh: boolean;
  additionalFilters?: Record<string, any>;
};

export type SortItemProps = {
  column: number;
  dir: string;
  name: string;
};

export type EmptyContentProps = {
  error: string;
};

export type ActionProps = {
  type: string;
  label: string;
  endpoint?: string;
  method?: string;
  confirm_message?: string;
  applicationId?: string;
  filename?: string;
};

export type PaginationProps = {
  current_page: number;
  total_pages: number;
  selected_row_count: number;
  total_row_count: number;
  onChangePerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageChange: (pageNumber: number) => void;
};

export type DeleteDialogProps = {
  open: boolean;
  modelTitle: string;
  onClose: () => void;
  action?: ActionProps;
  loading: boolean;
  refresh: () => void;
};

export type FilterProps = {
  name: string;
  key: string;
  type: string;
  place_holder: string;
  endpoint?: string;
  data?: { value: string; label: string }[];
};
