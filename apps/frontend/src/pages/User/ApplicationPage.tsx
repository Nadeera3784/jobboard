import { useState } from 'react';
import { Table } from '../../components/Table';
import { ColumnProps } from '../../types';
import { AppConstants } from '../../constants';

export const ApplicationPage = () => {
  const [refresh] = useState(false);

  const columns: ColumnProps[] = [
    {
      name: 'job_name',
      label: 'Job Name',
      type: 'text',
      orderable: true,
      visible: true,
      width: '40%',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'label',
      orderable: true,
      visible: true,
      width: '30%',
    },
    {
      name: 'created_at',
      label: 'Applied Date',
      type: 'date',
      orderable: true,
      visible: true,
      width: '30%',
    },
  ];

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 py-3 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              My Applications
            </h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
            <Table
              endpoint={`${AppConstants.API_URL}/applications/datatable`}
              per_page={10}
              columns={columns}
              has_row_buttons={false}
              has_multiselect={false}
              filters={[]}
              refresh={refresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
