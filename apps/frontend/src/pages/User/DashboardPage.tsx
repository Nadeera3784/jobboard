import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  TrendingUp,
  User,
  Calendar,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { httpClient } from '../../utils';
import { HttpStatus } from '../../constants';

interface UserAnalytics {
  totalApplications: number;
  recentApplications: number;
  weeklyApplications: number;
  statusBreakdown: {
    'Application submitted': number;
    'Application viewed': number;
    'Application rejected': number;
    'Resume downloaded': number;
  };
  profileCompletion: {
    percentage: number;
    completedFields: number;
    totalFields: number;
    missingFields: string[];
  };
  latestApplications: Array<{
    jobTitle: string;
    companyName: string;
    status: string;
    appliedDate: string;
  }>;
  accountAge: number;
}

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.get('/analytics/user');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Application submitted':
        return <FileText className="h-4 w-4" />;
      case 'Application viewed':
        return <Eye className="h-4 w-4" />;
      case 'Application rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Resume downloaded':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Application submitted':
        return 'text-blue-600';
      case 'Application viewed':
        return 'text-yellow-600';
      case 'Application rejected':
        return 'text-red-600';
      case 'Resume downloaded':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <Link
                to="/user/settings"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-8">
          {/* Main Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Total Applications */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Applications
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalApplications || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Recent Applications
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics?.recentApplications || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Applications */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      This Week
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics?.weeklyApplications || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Applications</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Profile Complete
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {analytics?.profileCompletion.percentage || 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics?.profileCompletion.completedFields}/
                      {analytics?.profileCompletion.totalFields} fields
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Object.entries(analytics?.statusBreakdown || {}).map(
              ([status, count]) => (
                <div
                  key={status}
                  className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {status}
                        </p>
                        <p
                          className={`text-2xl font-bold ${getStatusColor(status)}`}
                        >
                          {count}
                        </p>
                      </div>
                      <div
                        className={`p-2 bg-gray-100 rounded-full ${getStatusColor(status)}`}
                      >
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Latest Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Latest Applications
            </h3>
            {analytics?.latestApplications &&
            analytics.latestApplications.length > 0 ? (
              <div className="space-y-3">
                {analytics.latestApplications.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {app.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600">{app.companyName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      <span className="text-sm font-medium">{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No applications yet. Start exploring jobs!
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/search"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium">Browse Jobs</span>
              </Link>
              <Link
                to="/user/applications"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium">My Applications</span>
              </Link>
              <Link
                to="/user/settings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium">Complete Profile</span>
              </Link>
            </div>
          </div>

          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Summary
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Member since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics?.accountAge || 0} days ago
                </p>
              </div>
              {analytics?.profileCompletion.missingFields &&
                analytics.profileCompletion.missingFields.length > 0 && (
                  <div>
                    <p className="text-sm text-red-600">
                      Complete your profile:
                    </p>
                    <p className="text-xs text-gray-500">
                      {analytics.profileCompletion.missingFields.join(', ')}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
