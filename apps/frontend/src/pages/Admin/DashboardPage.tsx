import { useEffect, useState } from 'react';
import {
  PlusCircle,
  Users,
  Building2,
  Briefcase,
  FileText,
  Eye,
  TrendingUp,
  Activity,
  MapPin,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import appStateStore from '../../store';
import { AdminAnalytics } from '../../types';
import { httpClient } from '../../utils';
import { HttpStatus } from '../../constants';

export const DashboardPage = () => {
  const { getCurrentUser, user } = appStateStore(state => state);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.get('/analytics/admin');

      if (response.data.statusCode === HttpStatus.OK) {
        setAnalytics(response.data.data);
      } else {
        setError('Failed to fetch analytics');
        toast.error('Failed to load analytics data');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100">
        <div className="container p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100">
        <div className="container p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Admin Dashboard
              </h2>
              <p className="text-gray-600">System overview and analytics</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-gray-600 h-9 px-4 py-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Quick Actions
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalUsers}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    +{analytics?.recentActivity.last30Days.users} this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Companies
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalCompanies}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    +{analytics?.recentActivity.last30Days.companies} this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Jobs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalJobs}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {analytics?.overview.activeJobs} active
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalApplications}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    +{analytics?.recentActivity.last30Days.applications} this
                    month
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Page Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalViews}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalCategories}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.overview.totalLocations}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Recent Activity & Top Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity (7 days)
                  </h3>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      New Users
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {analytics?.recentActivity.last7Days.users}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      New Jobs
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {analytics?.recentActivity.last7Days.jobs}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      New Applications
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {analytics?.recentActivity.last7Days.applications}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Categories
                </h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {analytics?.topCategories
                    .slice(0, 5)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {category.jobCount} jobs
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Locations
                </h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {analytics?.topLocations
                    .slice(0, 5)
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {location.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {location.jobCount} jobs
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Top Companies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Most Active Companies
                </h3>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {analytics?.topCompanies.slice(0, 5).map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {company.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {company.jobCount} jobs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  System Health
                </h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.systemHealth.averageApplicationsPerJob}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg Applications per Job
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.systemHealth.averageViewsPerJob}
                  </p>
                  <p className="text-sm text-gray-600">Avg Views per Job</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.systemHealth.jobCompletionRate}%
                  </p>
                  <p className="text-sm text-gray-600">Job Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
