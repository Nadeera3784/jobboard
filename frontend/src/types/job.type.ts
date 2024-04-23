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
};

export type JobCardProps = {
  job: Job;
};
