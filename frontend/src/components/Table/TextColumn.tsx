type TextColumnProps = {
  text: string;
  width: string;
};

export const TextColumn: React.FC<TextColumnProps> = ({ text, width }) => {
  return <div className={`${width !== '' ? `w-[${width}]` : ''}`}>{text}</div>;
};
