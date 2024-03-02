interface SharedFilters {
  job_types: string[];
  remote: string[];
  experience_level: string[];
}

export const SharedFilters = (): SharedFilters => {
  return {
    job_types: [
      'Full-time',
      'Part-time',
      'Contract',
      'Internship',
      'Temporary',
    ],
    remote: ['Remote', 'On-site', 'Hybrid'],
    experience_level: [
      'Internship',
      'Associate',
      'Director',
      'Entry level',
      'Mid-Senior level',
      'Executive',
    ],
  };
};
