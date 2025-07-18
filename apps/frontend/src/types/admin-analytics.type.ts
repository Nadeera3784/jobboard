export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    totalCompanies: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalCategories: number;
    totalLocations: number;
    totalViews: number;
  };
  recentActivity: {
    last30Days: {
      users: number;
      companies: number;
      jobs: number;
      applications: number;
    };
    last7Days: {
      users: number;
      jobs: number;
      applications: number;
    };
  };
  topCategories: Array<{
    name: string;
    jobCount: number;
  }>;
  topLocations: Array<{
    name: string;
    jobCount: number;
  }>;
  topCompanies: Array<{
    name: string;
    jobCount: number;
  }>;
  applicationStatus: Record<string, number>;
  growth: {
    monthlyUsers: Array<{
      month: string;
      count: number;
    }>;
    monthlyJobs: Array<{
      month: string;
      count: number;
    }>;
  };
  systemHealth: {
    averageApplicationsPerJob: string;
    averageViewsPerJob: string;
    jobCompletionRate: string;
  };
} 