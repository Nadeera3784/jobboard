import { SharedFilterInterface } from '../modules/app/interfaces/shared-filter.Interface';

export const SharedFilters = (): SharedFilterInterface => {
  return {
    job_type: [
      {
        _id: 'Full-time',
        name: 'Full-time',
      },
      {
        _id: 'Part-time',
        name: 'Part-time',
      },
      {
        _id: 'Contract',
        name: 'Contract',
      },
      {
        _id: 'Internship',
        name: 'Internship',
      },
      {
        _id: 'Temporary',
        name: 'Temporary',
      },
    ],
    remote: [
      {
        _id: 'Remote',
        name: 'Remote',
      },
      {
        _id: 'On-site',
        name: 'On-site',
      },
      {
        _id: 'Hybrid',
        name: 'Hybrid',
      },
    ],
    experience_level: [
      {
        _id: 'Internship',
        name: 'Internship',
      },
      {
        _id: 'Associate',
        name: 'Associate',
      },
      {
        _id: 'Director',
        name: 'Director',
      },
      {
        _id: 'Entry level',
        name: 'Entry level',
      },
      {
        _id: 'Mid-Senior level',
        name: 'Mid-Senior level',
      },
      {
        _id: 'Executive',
        name: 'Executive',
      },
    ],
  };
};
