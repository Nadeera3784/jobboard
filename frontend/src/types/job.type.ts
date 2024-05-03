export type Job = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  remote: string;
  job_type: string;
  experience_level: string;
  user: string;
  expired_at: string;
  company_name: string;
  company_logo?: {
    key: string;
    value: string;
  };
  location_name?: string;
};

export type JobCardProps = {
  job: Job;
};
