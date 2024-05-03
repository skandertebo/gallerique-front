export interface CountItemProps {
  title: string;
  count: string;
}

const CountItem: React.FC<CountItemProps> = ({ title, count }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-medium text-palette-5">{count}</span>
      <span className="text-2xl text-black font-medium">{title}</span>
    </div>
  );
};

export default CountItem;
