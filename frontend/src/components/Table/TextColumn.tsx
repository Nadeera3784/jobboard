type TextColumnProps = {
  data: string;
};

export const TextColumn: React.FC<TextColumnProps> = ({ data }) => {
  return (
      <>{data}</>
  );
};