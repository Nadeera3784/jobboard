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
import { Intercom } from '../../utils';
import { HttpStatus } from '../../constants';

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  modelTitle,
  onClose,
  action,
  refresh,
}) => {
  const onClickDelete = async () => {
    if (action && action.endpoint) {
      try {
        const response = await Intercom.delete(action.endpoint);
        if (response.status === HttpStatus.OK) {
          onClose();
          toast.warning(response?.data?.message || 'Deleted Successfully!');
          refresh();
        } else {
          toast.warning('Something went wrong, Please try again later');
        }
      } catch (error) {
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
