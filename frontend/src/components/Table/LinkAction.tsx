import { FilePenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../Form/Button';
import { ActionProps } from '../../types';

export const LinkAction = ({ data }: { data: ActionProps }) => {
  return (
    <>
      {data?.endpoint && (
        <Link to={data?.endpoint}>
          <Button variant="outline" size={'sm'}>
            <FilePenLine className="mr-2 h-4 w-4" />
            {data.label}
          </Button>
        </Link>
      )}
    </>
  );
};
