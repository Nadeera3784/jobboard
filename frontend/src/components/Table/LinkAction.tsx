import { FilePenLine } from 'lucide-react';

type LinkActionProps = {
    name: string;
    link: string;
};

export const LinkAction: React.FC<LinkActionProps> = ({ name }) => {
    return (
        <button
            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8"
            type="button"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:r3t:"
            data-state="closed"
        >
            <FilePenLine
                className="mr-2 h-4 w-4"
            />
            {name}
        </button>
    );
};


