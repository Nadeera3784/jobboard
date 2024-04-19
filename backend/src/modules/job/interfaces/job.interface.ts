import * as mongoose from 'mongoose';

export interface JobInterface {
  _id: string;
  name: string;
  description: string;
  category: string;
  category_name: string;
  location: string;
  user: string;
  remote: string;
  job_type: string;
  experience_level: string;
  created_at: string;
}
