import { EmptyContentProps } from '../../types/index';

export const EmptyContent: React.FC<EmptyContentProps> = ({ error }) => {
  return (
    <tr style={{ textAlign: 'center' }}>
      <td style={{ textAlign: 'center', verticalAlign: 'middle' }} width="100%">
        <h1 className="text-2xl text-gray-600">
          {error ? error : 'No data available'}
        </h1>
      </td>
    </tr>
  );
};
