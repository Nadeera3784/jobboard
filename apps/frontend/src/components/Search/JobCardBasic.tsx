import { Link } from 'react-router-dom';
import { JobCardProps } from '../../types';
import { limitString, removeHtmlTags, trackAnalytics } from '../../utils';
import PlaceholderAvatar from '../Shared/PlaceholderAvatar';
import { BriefcaseIconV2, Type, LocationMarkerIconV2 } from '../Icons';

const JobCardBasic: React.FC<JobCardProps> = ({ job }) => {
  const handleApplyClick = () => {
    // Track job view when user clicks to apply/view details
    if (job._id) {
      trackAnalytics({
        jobId: job._id,
        type: 'view_count',
      });
    }
  };

  return (
    <div className="w-full lg:w-1/3 p-4">
      <div className="p-6 bg-white shadow rounded-[24px]">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            {job?.company_logo && job?.company_logo?.value ? (
              <img
                className="w-20 h-20 p-1 mr-4 rounded-full border border-indigo-50"
                src={job.company_logo.value}
                alt=""
              />
            ) : (
              <PlaceholderAvatar name={job.company_name} />
            )}
            <div>
              <div className="flex mb-2">
                <h3 className="font-medium" data-config-id="name1">
                  {job.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500" data-config-id="job1">
                {job.company_name}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-7">
          <p className="text-sm">
            {removeHtmlTags(limitString(job.description, 150))}
          </p>
        </div>
        <div className="flex mb-4 justify-between items-center">
          <div className="flex items-center">
            <span className="inline-block mr-2">
              <LocationMarkerIconV2 className="" />
            </span>
            <h4 className="text-sm text-gray-500" data-config-id="label1-1">
              Location
            </h4>
          </div>
          <span className="text-sm" data-config-id="value1-1">
            {job.location_name}
          </span>
        </div>
        <div className="flex mb-4 justify-between items-center">
          <div className="flex items-center">
            <span className="inline-block mr-2">
              <Type className="" />
            </span>
            <h4 className="text-sm text-gray-500">Type</h4>
          </div>
          <span className="text-sm">{job.job_type}</span>
        </div>
        <div className="flex mb-6 justify-between items-center">
          <div className="flex items-center">
            <span className="inline-block mr-2">
              <BriefcaseIconV2 className="" />
            </span>
            <h4 className="text-sm text-gray-500">Remote</h4>
          </div>
          <span className="text-sm">{job.remote}</span>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full px-2 mb-2 md:mb-0">
            <Link
              to={`/search?jobid=${job._id}`}
              onClick={handleApplyClick}
              className="flex justify-center py-4 text-sm text-white bg-black hover:bg-gray-900 rounded-[12px] transition duration-200"
            >
              <span>Apply now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardBasic;
