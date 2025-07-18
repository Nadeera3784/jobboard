import { httpClient } from './HttpClient';

interface TrackAnalyticsParams {
  jobId: string;
  type: 'view_count' | 'application_count';
}

export const trackAnalytics = async ({ jobId, type }: TrackAnalyticsParams) => {
  try {
    await httpClient.post('/analytics', {
      job: jobId,
      type: type,
    });
    // Silently track analytics - don't show errors to users
  } catch (error) {
    // Silently fail - analytics shouldn't break user experience
    console.warn('Analytics tracking failed:', error);
  }
}; 