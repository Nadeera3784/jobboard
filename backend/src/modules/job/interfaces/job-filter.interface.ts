export interface JobFilterInterface {
  category?: { $regex: RegExp };
  location?: { $regex: RegExp };
  remote?: { $regex: RegExp };
  job_type?: { $regex: RegExp };
  experience_level?: { $regex: RegExp };
}
