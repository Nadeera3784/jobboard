export type ColumnProps = {
    name: string;
    label: string;
    type: string;
    orderable: boolean;
    visible: boolean;
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
  has_row_buttons: boolean;
  has_multiselect: boolean;
  refresh: boolean;
};

export type SortItemProps = {
    column: number;
    dir: string;
    name: string;
};

export type EmptyContentProps = {
    error: string
}

export type ActionProps = {
    type: string; 
    label: string;
    endpoint?: string;
    method?: string;
    confirm_message?: string;
}

export type PaginationProps = {
    current_page: number;
    total_pages: number;
    selected_row_count: number;
    total_row_count: number;
    onChangePerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handlePageChange: (pageNumber: number) => void;
}
  