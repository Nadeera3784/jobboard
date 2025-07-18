import { PanelTopOpen } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { JobCardProps } from '../../types';
import {
  BriefcaseIcon,
  LocationMarkerIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from '../Icons';
import { httpClient, trackAnalytics } from '../../utils';
import { AppConstants, HttpStatus } from '../../constants';
import appStateStore from '../../store';

const JobDetailsCard: React.FC<JobCardProps> = ({ job }) => {
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  const { user } = appStateStore(state => state);

  const handleApply = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to apply for jobs');
      navigate('/auth');
      return;
    }

    setIsApplying(true);

    try {
      const response = await httpClient.post(
        `${AppConstants.API_URL}/applications/jobs/${job._id}`,
        { user: user._id },
      );

      if (response.status === HttpStatus.OK) {
        toast.success(
          response.data.message || 'Application submitted successfully!',
        );

        // Track application analytics
        if (job._id) {
          trackAnalytics({
            jobId: job._id,
            type: 'application_count',
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit application';

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Please log in to apply for jobs');
        navigate('/auth');
      } else if (
        error.response?.status === 400 &&
        errorMessage.includes('profile')
      ) {
        // Profile incomplete error
        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/user/settings');
        }, 2000);
      } else if (error.response?.status === 409) {
        // Already applied error
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 xl:flex xl:items-center xl:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {job?.name}
          </h1>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-8">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <BriefcaseIcon
                className={'flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'}
              />
              {job?.job_type}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <LocationMarkerIcon
                className={'flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'}
              />
              {job?.remote}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon
                className={'flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'}
              />
              $120k – $140k
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon
                className={'flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'}
              />
              Closing on {moment(job?.expired_at).format('Y MMMM, d')}
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <p
                  className="mt-1 text-sm text-gray-900"
                  dangerouslySetInnerHTML={{ __html: job?.description }}
                />
              </div>
            </dl>
            <div className="mt-3">
              <div className="flex">
                <span>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={isApplying}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PanelTopOpen className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetailsCard;
