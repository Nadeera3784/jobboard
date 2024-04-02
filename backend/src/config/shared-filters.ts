import { SharedFilterInterface } from '../modules/app/interfaces/shared-filter.Interface';

export const SharedFilters = (): SharedFilterInterface => {
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
