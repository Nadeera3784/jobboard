import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobPage = () => {
    return (
      <div className="bg-gray-100">
        <div className="container p-4 lg:p-8">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
              <div className="flex items-center space-x-2">
                <Link 
                to="/company/jobs/create"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-gray-600 h-9 px-4 py-2">
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Create A New Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  