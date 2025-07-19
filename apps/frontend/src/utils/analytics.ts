import { Intercom } from './Intercom';

interface TrackAnalyticsParams {
  jobId: string;
  type: 'view_count' | 'application_count';
}

export const trackAnalytics = async ({ jobId, type }: TrackAnalyticsParams) => {
  try {
    await Intercom.post('/analytics', {
      job: jobId,
      type: type,
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};
