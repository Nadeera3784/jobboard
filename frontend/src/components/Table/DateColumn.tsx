type DateColumnProps = {
    data: string;
};

export const DateColumn: React.FC<DateColumnProps> = ({ data }) => {
    return (
        <>{new Date(data).toLocaleDateString()}</>
    );
};


