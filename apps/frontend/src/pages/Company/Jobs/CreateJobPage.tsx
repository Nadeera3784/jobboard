import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

import { Button } from '../../../components/Form/Button';

export const CreateJobPage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <div className="flex items-center space-x-2">
              <Link to="/company/jobs">
                <Button variant="default">
                  <MoveLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <div className="space-y-4 lg:space-y-8"></div>
        </div>
      </div>
    </div>
  );
};
