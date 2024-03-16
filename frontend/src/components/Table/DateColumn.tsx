type DateColumnProps = {
    data: string;
};

export const DateColumn: React.FC<DateColumnProps> = ({ data }) => {
    return (
        <div className="flex w-[100px] items-center">{new Date(data).toLocaleDateString()}</div>
    );
};


