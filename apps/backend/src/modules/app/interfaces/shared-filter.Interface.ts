export interface SharedFilterInterface {
  job_type: Array<{
    _id: string;
    name: string;
  }>;
  remote: Array<{
    _id: string;
    name: string;
  }>;
  experience_level: Array<{
    _id: string;
    name: string;
  }>;
}
