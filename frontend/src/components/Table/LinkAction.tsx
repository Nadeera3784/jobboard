import { FilePenLine } from 'lucide-react';

import { Button } from '../Form/Button';
import { ActionProps } from '../../types';

export const LinkAction = ({ data }: { data: ActionProps }) => {
    return (
        <Button
          variant="outline"
          size={'sm'}
         >
            <FilePenLine className="mr-2 h-4 w-4"/>
            {data.label}
        </Button>
    );
};


