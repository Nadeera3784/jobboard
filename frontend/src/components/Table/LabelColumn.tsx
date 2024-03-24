type LabelColumnProps = {
    text: string;
};

export const LabelColumn: React.FC<LabelColumnProps> = ({ text}) => {
    return (
        <div className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase`}>
            {text}
        </div>
    );
};


