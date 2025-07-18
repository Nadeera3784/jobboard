import { ChangeEvent, useEffect, useState } from 'react';

import { httpClient, trackAnalytics } from '../../utils';
import { HttpStatus } from '../../constants';
import { ApiResponse, ResponseState } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/Form/Select';
import { Input } from '../../components/Form/Input';
import { FilterOption, Filters, Job } from '../../types';
import Pagination from '../../components/Search/Pagination';
import JobDetailsCard from '../../components/Search/JobDetailsCard';
import EmptyDetails from '../../components/Search/EmptyDetails';
import PlaceholderAvatar from '../../components/Shared/PlaceholderAvatar';

export const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [order, setOrder] = useState({
    name: 1,
    category: 1,
    location: 1,
    remote: 1,
    job_type: 1,
    experience_level: 1,
  });
  const [search, setSearch] = useState({
    $regex: '',
    $options: 'i',
  });
  const [filter, setFilter] = useState<Filters>({
    category: null,
    location: null,
    remote: null,
    job_type: null,
    experience_level: null,
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    category: null,
    location: null,
    remote: null,
    job_type: null,
    experience_level: null,
  });

  const [selectedJob, setSelectedJob] = useState({
    _id: '',
  });

  // Replace hooks with direct state management
  const [response, setResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  const [searchReponse, setSearchResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  const [jobReponse, setJobResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  // Direct API call functions
  const process = async (params: string) => {
    setResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const URL = `/${params}`;
    try {
      const apiResponse = await httpClient.get<ApiResponse>(URL);
      setResponse({
        errored: false,
        status: apiResponse.data.statusCode === HttpStatus.OK,
        message: apiResponse.data.message,
        data: apiResponse.data.data,
        status_code: apiResponse.status,
        loading: false,
      });
    } catch (error: any) {
      setResponse({
        errored: true,
        message:
          error.response?.data.errors ||
          error.response?.data.message ||
          error.message,
        data: {},
        status: false,
        status_code: error.response?.status || HttpStatus.BAD_REQUEST,
        loading: false,
      });
    }
  };

  const processSearch = async (query: string) => {
    setSearchResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const ENDPOINT = `/jobs/search${query}`;
    try {
      const apiResponse = await httpClient.get<ApiResponse>(ENDPOINT);
      setSearchResponse({
        errored: false,
        status: apiResponse.data.statusCode === HttpStatus.OK,
        message: apiResponse.data.message,
        data: apiResponse.data.data,
        status_code: apiResponse.status,
        loading: false,
      });
    } catch (error: any) {
      setSearchResponse({
        errored: true,
        message:
          error.response?.data.errors ||
          error.response?.data.message ||
          error.message,
        data: {},
        status: false,
        status_code: error.response?.status || HttpStatus.BAD_REQUEST,
        loading: false,
      });
    }
  };

  const processGetById = async (params: string) => {
    setJobResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const URL = `/${params}`;
    try {
      const apiResponse = await httpClient.get<ApiResponse>(URL);
      setJobResponse({
        errored: false,
        status: apiResponse.data.statusCode === HttpStatus.OK,
        message: apiResponse.data.message,
        data: apiResponse.data.data,
        status_code: apiResponse.status,
        loading: false,
      });
    } catch (error: any) {
      setJobResponse({
        errored: true,
        message:
          error.response?.data.errors ||
          error.response?.data.message ||
          error.message,
        data: {},
        status: false,
        status_code: error.response?.status || HttpStatus.BAD_REQUEST,
        loading: false,
      });
    }
  };
  let jobid = new URLSearchParams(window.location.search).get('jobid');

  useEffect(() => {
    process('app/shared/filters');
  }, [response.status]);

  useEffect(() => {
    const queryURL = `?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(JSON.stringify(search))}&order=${encodeURIComponent(JSON.stringify(order))}&limit=${limit}&page=${currentPage}`;
    processSearch(queryURL);
  }, [searchReponse.status, currentPage, search, filter, order]);

  useEffect(() => {
    if (selectedJob._id) {
      processGetById(`jobs/${selectedJob._id}`);
    }
  }, [selectedJob]);

  useEffect(() => {
    if (jobid) {
      setSelectedJob({ _id: jobid });
    }
  }, [jobid]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch({ $regex: event.currentTarget.value, $options: 'i' });
  };

  const updateFilter = (
    filterKey: keyof Filters,
    value: FilterOption | null,
  ) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      [filterKey]: value,
    }));
    setAppliedFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  const onRemoveFilter = (filterKey: keyof Filters) => {
    setAppliedFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: null,
    }));
    setFilter(prevFilter => ({
      ...prevFilter,
      [filterKey]: null,
    }));
  };

  const onChangeFilter = (filterKey: keyof Filters) => (value: string) => {
    if (value === '') {
      onRemoveFilter(filterKey);
    } else {
      const selectedOption = response.data[`${filterKey}`].find(
        (option: FilterOption) => option._id === value,
      );
      updateFilter(filterKey, selectedOption || null);
    }
  };

  const onOrderChange = (value: string) => {
    const [propertyName, direction] = value.split('-');
    const directionValue = direction === 'desc' ? -1 : 1;
    setOrder(prevOrder => ({
      ...prevOrder,
      [propertyName]: directionValue,
    }));
  };

  const getTotalCount = (count: number, limit: number) => {
    return Math.ceil(count / limit);
  };

  const onClickGetJobDetails = async (job: Job) => {
    setSelectedJob(job);
    
    // Track job view analytics
    if (job._id) {
      trackAnalytics({
        jobId: job._id,
        type: 'view_count',
      });
    }
  };

  const startPage = Math.max(1, currentPage - 2);

  const endPage = Math.min(
    getTotalCount(searchReponse.data.count, limit),
    startPage + 4,
  );

  return (
    <div className="relative h-full max-w-7xl mx-auto">
      <div className="bg-white mt-5">
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative z-10 bg-white border-b border-gray-200 py-3">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between sm:px-6 lg:px-8">
              <div className="relative flex text-left">
                <div>
                  <Select onValueChange={onOrderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(order).map((propertyName, key) => (
                        <SelectItem key={key} value={`${propertyName}-asc`}>
                          {propertyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <button
                type="button"
                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              >
                Filters
              </button>
              <div>
                <Input
                  className="h-8 w-[150px] lg:w-[250px]"
                  placeholder="search..."
                  onChange={event => onSearch(event)}
                />
              </div>
              <div className="hidden sm:block">
                <div className="flow-root">
                  <div className="-mx-4 flex items-center divide-x divide-gray-200">
                    {[
                      'location',
                      'category',
                      'job_type',
                      'experience_level',
                      'remote',
                    ].map(filterKey => (
                      <div
                        key={filterKey}
                        className="px-4 relative inline-block text-left"
                      >
                        <Select
                          disabled={response.loading}
                          onValueChange={onChangeFilter(
                            filterKey as keyof Filters,
                          )}
                          value={
                            appliedFilters[filterKey as keyof Filters]?._id ||
                            ''
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                filterKey.charAt(0).toUpperCase() +
                                filterKey.slice(1)
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {response?.data?.[`${filterKey}`]?.map(
                              (option: FilterOption) => (
                                <SelectItem key={option._id} value={option._id}>
                                  {option.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Active filters */}
          <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Filters
                <span className="sr-only">, active</span>
              </h3>
              <div
                aria-hidden="true"
                className="hidden w-px h-5 bg-gray-300 sm:block sm:ml-4"
              />
              <div className="mt-2 sm:mt-0 sm:ml-4">
                <div className="-m-1 flex flex-wrap items-center">
                  {Object.entries(appliedFilters).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="m-1 inline-flex rounded-full border border-gray-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white text-gray-900"
                        >
                          <span>{value.name}</span>
                          <button
                            type="button"
                            onClick={() => onRemoveFilter(key as keyof Filters)}
                            className="flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                          >
                            <span className="sr-only">
                              Remove filter for {key}
                            </span>
                            <svg
                              className="h-2 w-2"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 8 8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="1.5"
                                d="M1 1l6 6m0-6L1 7"
                              />
                            </svg>
                          </button>
                        </span>
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-auto flex-col lg:flex-row">
        <div className="flex-none lg:flex flex-col w-full lg:w-2/5 xl:w-2/5 bg-gray-50">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul
              role="list"
              className="divide-y divide-gray-200 min-h-0  overflow-y-auto"
            >
              {searchReponse?.data?.data &&
                (searchReponse.data.data as any[]).map((job, key) => (
                  <li key={key} onClick={() => onClickGetJobDetails(job)}>
                    <div className="block hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-start">
                          <div className="flex-shrink-0">
                            {job?.company_logo && job?.company_logo?.value ? (
                              <img
                                className="h-12 w-12 rounded-full"
                                src={job.company_logo.value}
                                alt=""
                              />
                            ) : (
                              <PlaceholderAvatar name={job.company_name} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                              <p className="text-xl font-medium text-balck">
                                {job.name}
                              </p>
                              <p className="flex items-center text-sm text-gray-500">
                                <span>
                                  {job.location_name} ({job.remote})
                                </span>
                              </p>
                              <p className="mt-2 text-sm text-gray-500">
                                <span>{job.job_type} </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              <li className="p-3">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                  startPage={startPage}
                  endPage={endPage}
                  totalCount={searchReponse.data.count}
                  limit={limit}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col max-w-10xl mx-auto w-full">
          {selectedJob._id !== '' && <JobDetailsCard job={jobReponse.data} />}

          {selectedJob._id == '' && <EmptyDetails />}
        </div>
      </div>
    </div>
  );
};
