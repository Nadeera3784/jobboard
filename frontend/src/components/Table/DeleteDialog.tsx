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
import { HttpStatus } from '../../constants';

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  modelTitle,
  onClose,
  action,
  loading,
  refresh,
}) => {
  const { response, process } = useSharedDelete();

  const onClickDelete = async () => {
    if (action && action.endpoint) {
      response.loading = loading;
      await process(action.endpoint);
      response.loading = loading;
      if (response.status_code === HttpStatus.OK) {
        onClose();
        toast.warning(response?.message || 'Deleted Successfully!');
        refresh();
      } else {
        toast.warning('Something went wrong, Please try again later');
      }
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
