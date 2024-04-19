import { FileQuestion } from 'lucide-react';

const EmptyDetails = () => {
    return (
        <div className="flex h-full shrink-0 items-center justify-center rounded-md border bg-white">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <FileQuestion className="h-16 w-16 text-muted-foreground"/>
                <h3 className="mt-4 text-lg font-semibold">No job found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Select a job form the search result
                </p>
            </div>
        </div>
    );
};

export default EmptyDetails;
