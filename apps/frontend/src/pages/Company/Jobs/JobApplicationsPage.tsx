import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

import { Table } from '../../../components/Table';
import { ColumnProps } from '../../../types';
import { AppConstants } from '../../../constants';
import { Button } from '../../../components/Form/Button';

export const JobApplicationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [refresh] = useState(false);

  const columns: ColumnProps[] = [
    {
      name: '_id',
      label: 'ID',
      type: 'text',
      orderable: false,
      visible: false,
    },
    {
      name: 'user_name',
      label: 'Applicant Name',
      type: 'text',
      orderable: true,
      visible: true,
      width: '25%',
    },
    {
      name: 'user_email',
      label: 'Email',
      type: 'text',
      orderable: true,
      visible: true,
      width: '25%',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'label',
      orderable: true,
      visible: true,
      width: '20%',
    },
    {
      name: 'created_at',
      label: 'Applied Date',
      type: 'date',
      orderable: true,
      visible: true,
      width: '20%',
    },
  ];

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Job Applications
            </h2>
            <div className="flex items-center space-x-2">
              <Link to="/company/jobs">
                <Button variant="default">
                  <MoveLeft className="mr-2 h-4 w-4" />
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Download buttons will only appear for
              applicants who have uploaded their resume. Downloading a resume
              will automatically update the application status to "Resume
              downloaded".
            </p>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <Table
            endpoint={`${AppConstants.API_URL}/applications/jobs/${id}/datatable`}
            per_page={10}
            columns={columns}
            has_row_buttons={true}
            has_multiselect={false}
            filters={[
              {
                name: 'Status',
                key: 'status',
                type: 'singleSelectStatic',
                place_holder: 'Select Status',
                data: [
                  {
                    value: 'Application submitted',
                    label: 'Application submitted',
                  },
                  {
                    value: 'Application viewed',
                    label: 'Application viewed',
                  },
                  {
                    value: 'Application rejected',
                    label: 'Application rejected',
                  },
                  {
                    value: 'Resume downloaded',
                    label: 'Resume downloaded',
                  },
                ],
              },
            ]}
            refresh={refresh}
          />
        </div>
      </div>
    </div>
  );
};
