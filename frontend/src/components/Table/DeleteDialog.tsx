import React from 'react';
import { toast } from 'sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "../Dialog/AlertDialog"
import {DeleteDialogProps } from '../../types';
import { useDeleteCategory } from '../../hooks/useDeleteCategory';

export const DeleteDialog : React.FC<DeleteDialogProps> = ({ open, modelTitle, onClose, action, loading, refresh}) => {

    const {response, process} = useDeleteCategory();

    const onClickDelete = async () => {
        if (action && action.endpoint) {
            response.loading = loading;
            await process({endpoint: action.endpoint});
            response.loading = loading;
            if (response.status) {
                onClose();
                refresh(); 
            } else {
                toast.warning("Something went wrong, Please try again later");
            }
        }
    }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modelTitle}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className='inline-flex items-center justify-center'>
          <AlertDialogCancel onClick={onClose}>No</AlertDialogCancel>
          <AlertDialogAction onClick={onClickDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};