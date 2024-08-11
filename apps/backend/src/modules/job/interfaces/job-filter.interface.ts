export interface FilterOption {
  _id: string;
  name: string;
}

export interface JobFilterInterface {
  category?: FilterOption;
  location?: FilterOption;
  remote?: FilterOption;
  job_type?: FilterOption;
  experience_level?: FilterOption;
}
