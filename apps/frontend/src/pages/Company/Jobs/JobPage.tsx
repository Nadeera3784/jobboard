import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Table } from '../../../components/Table';
import { useState } from 'react';
import { AppConstants } from '../../../constants';

export const JobPage = () => {
  const [refresh] = useState(false);

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 py-3 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <div className="flex items-center space-x-2">
              <Link
                to="/company/jobs/create"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-gray-600 h-9 px-4 py-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create A New Job
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <div className="space-y-4 lg:space-y-8">
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
              <Table
                endpoint={`${AppConstants.API_URL}/jobs/datatable`}
                per_page={10}
                has_row_buttons={true}
                has_multiselect={false}
                refresh={refresh}
                columns={[
                  {
                    name: '_id',
                    label: 'ID',
                    type: 'text',
                    orderable: false,
                    visible: false,
                  },
                  {
                    name: 'name',
                    label: 'Title',
                    type: 'text',
                    orderable: true,
                    visible: true,
                  },
                  {
                    name: 'remote',
                    label: 'Remote',
                    type: 'text',
                    orderable: true,
                    visible: true,
                  },
                  {
                    name: 'job_type',
                    label: 'Type',
                    type: 'text',
                    orderable: true,
                    visible: true,
                  },
                  {
                    name: 'created_at',
                    label: 'Created',
                    type: 'date',
                    orderable: true,
                    visible: true,
                  },
                  {
                    name: 'expired_at',
                    label: 'Expired',
                    type: 'date',
                    orderable: true,
                    visible: true,
                  },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'text',
                    orderable: true,
                    visible: true,
                    width: '100px',
                  },
                ]}
                filters={[
                  {
                    name: 'Status',
                    key: 'status',
                    type: 'singleSelectStatic',
                    place_holder: 'Select Status',
                    data: [
                      {
                        value: 'Active',
                        label: 'Active',
                      },
                      {
                        value: 'InActive',
                        label: 'InActive',
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
