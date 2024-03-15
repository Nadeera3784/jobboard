export type TableColumn = {
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
  columns: TableColumn[];
  has_row_buttons: boolean;
};

export type SortItem = {
    column: number;
    dir: string;
    name: string;
};

export type EmptyContentProps = {
    error: string
}