import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Intercom } from '../../../utils';
import { HttpStatus } from '../../../constants';
import { User } from '../../../types';
import { Table } from '../../../components/Table';

interface CompanyAnalytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  recentApplications: number;
  jobsExpiringSoon: number;
}

export const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch company details
      const companyResponse = await Intercom.get(`/users/${id}`);
      if (companyResponse.data.statusCode === HttpStatus.OK) {
        setCompany(companyResponse.data.data);
      }

      // TODO: Fetch company analytics when API is available
      // For now, we'll show a placeholder or skip this section
      setAnalytics({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        recentApplications: 0,
        jobsExpiringSoon: 0,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch company data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const tableFilters = useMemo(
    () => ({
      companyId: id,
    }),
    [id],
  );

  if (loading) {
    return (
      <div className="bg-gray-100">
        <Helmet>
          <title>Admin | Company Details</title>
        </Helmet>
        <div className="container p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-gray-100">
        <Helmet>
          <title>Admin | Company Not Found</title>
        </Helmet>
        <div className="container p-4 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {error || 'Company not found'}
              </p>
              <Link
                to="/admin/users"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back to Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <Helmet>
        <title>Admin | {company.name}</title>
      </Helmet>
      <div className="container p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/users"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <p className="text-gray-600">Company Details & Analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to={`/admin/users/${company._id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit Company
            </Link>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {company.image?.value ? (
                  <img
                    src={company.image.value}
                    alt={company.name}
                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Company Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-2 h-4 w-4" />
                        {company.email}
                      </div>
                      {company.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="mr-2 h-4 w-4" />
                          {company.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        Member since{' '}
                        {company.created_at
                          ? new Date(company.created_at).toLocaleDateString()
                          : 'Unknown'}
                      </div>
                      <div className="flex items-center text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            company.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {company.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Additional Details
                    </h3>
                    <div className="space-y-2">
                      {company.about && (
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            About:
                          </p>
                          <p className="text-sm text-gray-700">
                            {company.about}
                          </p>
                        </div>
                      )}
                      {(company.city || company.state || company.country) && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            {[company.city, company.state, company.country]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Jobs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalJobs}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.activeJobs}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
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
                    {analytics.totalApplications}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalViews}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Company Jobs
            </h2>
            <p className="text-gray-600">All jobs posted by {company.name}</p>
          </div>
          <div className="p-6">
            <Table
              endpoint={`/jobs/datatable`}
              per_page={10}
              has_row_buttons={true}
              has_multiselect={false}
              refresh={false}
              additionalFilters={tableFilters}
              columns={[
                {
                  name: '_id',
                  label: 'ID',
                  type: 'text',
                  orderable: false,
                  visible: false,
                },
                {
                  name: 'name',
                  label: 'Job Title',
                  type: 'text',
                  orderable: true,
                  visible: true,
                },
                {
                  name: 'job_type',
                  label: 'Type',
                  type: 'label',
                  orderable: true,
                  visible: true,
                },
                {
                  name: 'experience_level',
                  label: 'Experience',
                  type: 'label',
                  orderable: true,
                  visible: true,
                },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'label',
                  orderable: true,
                  visible: true,
                },
                {
                  name: 'created_at',
                  label: 'Posted',
                  type: 'date',
                  orderable: true,
                  visible: true,
                },
                {
                  name: 'expired_at',
                  label: 'Expires',
                  type: 'date',
                  orderable: true,
                  visible: true,
                },
              ]}
              filters={[
                {
                  name: 'Status',
                  key: 'status',
                  type: 'singleSelectStatic',
                  place_holder: 'Select Status',
                  data: [
                    {
                      value: 'Active',
                      label: 'Active',
                    },
                    {
                      value: 'InActive',
                      label: 'InActive',
                    },
                  ],
                },
                {
                  name: 'Job Type',
                  key: 'job_type',
                  type: 'singleSelectStatic',
                  place_holder: 'Select Type',
                  data: [
                    {
                      value: 'Full-time',
                      label: 'Full-time',
                    },
                    {
                      value: 'Part-time',
                      label: 'Part-time',
                    },
                    {
                      value: 'Contract',
                      label: 'Contract',
                    },
                    {
                      value: 'Internship',
                      label: 'Internship',
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
