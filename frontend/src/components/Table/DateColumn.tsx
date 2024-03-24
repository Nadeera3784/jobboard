type DateColumnProps = {
    data: string;
};

export const DateColumn: React.FC<DateColumnProps> = ({ data }) => {
    return (
        <div className="w-[100px]">{new Date(data).toLocaleDateString()}</div>
    );
};


