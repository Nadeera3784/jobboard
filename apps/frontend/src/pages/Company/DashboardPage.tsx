import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Briefcase,
  Users,
  Eye,
  Clock,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Intercom } from '../../utils';
import { HttpStatus } from '../../constants';

interface CompanyAnalytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  recentApplications: number;
  totalViews: number;
  jobsExpiringSoon: number;
  performance: {
    averageApplicationsPerJob: string;
    averageViewsPerJob: string;
  };
}

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await Intercom.get('/analytics/company');

      if (response.data.statusCode === HttpStatus.OK) {
        setAnalytics(response.data.data);
      } else {
        setError('Failed to fetch analytics');
        toast.error('Failed to load analytics data');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <div className="flex-1 space-y-4 py-3 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Link
                to="/company/jobs/create"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-gray-600 h-9 px-4 py-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Job
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          {/* Main Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Total Jobs */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Jobs
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalJobs || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Jobs
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics?.activeJobs || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Applications */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Applications
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics?.totalApplications || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Views */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Views
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {analytics?.totalViews || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Eye className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Recent Applications */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Recent Applications
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {analytics?.recentApplications || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Expiring Soon */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Jobs Expiring Soon
                    </p>
                    <p className="text-xl font-semibold text-red-600">
                      {analytics?.jobsExpiringSoon || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Performance
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Avg. Applications per Job
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {analytics?.performance.averageApplicationsPerJob ||
                          '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Avg. Views per Job
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {analytics?.performance.averageViewsPerJob || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/company/jobs"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium">Manage Jobs</span>
              </Link>
              <Link
                to="/company/jobs/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PlusCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">Create New Job</span>
              </Link>
              <Link
                to="/company/settings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium">Company Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
