import { Trash } from 'lucide-react';

import { Button } from '../Form/Button';
import { ActionProps } from '../../types';

export const DeleteAction = ({
  data,
  onClickOpenDialog,
}: {
  data: ActionProps;
  onClickOpenDialog: () => void;
}) => {
  return (
    <Button variant="outline" size="sm" onClick={onClickOpenDialog}>
      <Trash className="mr-2 h-4 w-4" />
      {data.label}
    </Button>
  );
};
