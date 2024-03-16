type TextColumnProps = {
  data: string;
};

export const TextColumn: React.FC<TextColumnProps> = ({ data }) => {
  return (
      <div className="flex w-[100px] items-center">{data}</div>
  );
};