import { ActionProps } from "./table.type";

export type updateCategory  = {
    name: string;
    status?: string;
}

export type GetCategory = {
    id: string;
}

export type DeleteCategory = {
    endpoint: string;
}

export type CreateCategory = {
    name: string;
}

export type  DeleteDialogProps = {
    open: boolean;
    modelTitle: string;
    onClose: () => void;
    action?: ActionProps;
    loading: boolean;
    refresh: () => void;
}
  
  