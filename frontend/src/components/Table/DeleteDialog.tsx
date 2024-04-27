import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../Dialog/AlertDialog';
import { DeleteDialogProps } from '../../types';
import { useSharedDelete } from '../../hooks/useSharedDelete';

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  modelTitle,
  onClose,
  action,
  loading,
  refresh,
}) => {
  const { response, process } = useSharedDelete();

  useEffect(() => {
    if (response.status) {
      onClose();
      toast.warning(response?.message || 'Deleted Successfully!');
      refresh();
    }
  }, [response.status]);

  const onClickDelete = async () => {
    if (action && action.endpoint) {
      response.loading = loading;
      process(action.endpoint);
      response.loading = false;
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modelTitle}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="inline-flex items-center justify-center">
          <AlertDialogCancel onClick={onClose}>No</AlertDialogCancel>
          <AlertDialogAction onClick={onClickDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
