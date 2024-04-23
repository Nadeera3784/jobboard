import { ChangeEvent, useEffect, useState } from 'react';

import { useGetFilters } from '../../hooks/Search/useGetFilters';
import { useGetSearch } from '../../hooks/Search/useGetSearch';
import { useGetJobById } from '../../hooks/Search/useGetJobById';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Form/Select';
import { Input } from '../../components/Form/Input';
import { Filters, Job} from '../../types';
import Pagination from '../../components/Search/Pagination';
import JobDetailsCard from '../../components/Search/JobDetailsCard';
import EmptyDetails from '../../components/Search/EmptyDetails';

export const SearchPage = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [order, setOrder] = useState({
        name: 1,
        category: 1,
        location: 1,
        remote: 1,
        job_type: 1,
        experience_level: 1
    });
    const [search, setSearch] = useState({
        $regex: '',
        $options: 'i'
    });
    const [filter, setFilter] = useState<Filters>({
        category: '',
        location: '',
        remote: '',
        job_type: '',
        experience_level: '',
    });
    const [appliedFilters, setAppliedFilters] = useState({});
    const [selectedJob, setSelectedJob] = useState<Job>({
        _id: '',
        name: '',
        description: '',
        category: '',
        location: '',
        remote: '',
        job_type: '',
        experience_level: '',
        user: '',
        expired_at: ''
    });
    const { response, process } = useGetFilters();
    const { response: searchReponse, process: processSearch } = useGetSearch();
    const { response: jobReponse, process: processGetById } = useGetJobById();


    useEffect(() => {
        process();
    }, [response.status]);

    useEffect(() => {
        const queryURL = `?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(JSON.stringify(search))}&order=${encodeURIComponent(JSON.stringify(order))}&limit=${limit}&page=${currentPage}`;
        processSearch(queryURL);
    }, [searchReponse.status, currentPage, search, filter, order]);

    useEffect(() => {
        processGetById(selectedJob._id);
    }, [selectedJob]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ $regex: event.currentTarget.value, $options: 'i' })
    }

    const updateFilter = (filterKey: string, value: string) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            [filterKey]: value
        }));
        setAppliedFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: value
        }));
        setCurrentPage(1);
    };

    const onRemoveFilter = (filterKey: string) => {
        const { [filterKey]: removedFilter, ...rest } = appliedFilters as { [key: string]: string };
        setAppliedFilters(rest);
        setFilter(prevFilter => ({
            ...prevFilter,
            [filterKey]: ''
        }));
    };

    const onChangeRemoteType = (value: string) => {
        updateFilter('remote', value);
    }

    const onChangeJobType = (value: string) => {
        updateFilter('job_type', value);
    }

    const onChangeExperienceLevel = (value: string) => {
        updateFilter('experience_level', value);
    }

    const onChangeLocation = (value: string) => {
        updateFilter('location', value);
    }

    const onChangeCategory = (value: string) => {
        updateFilter('category', value);
    }

    const onOrderChange = (value: string) => {
        const [propertyName, direction] = value.split('-');
        const directionValue = direction === 'desc' ? -1 : 1;
        setOrder(prevOrder => ({
            ...prevOrder,
            [propertyName]: directionValue
        }));
    };

    const getTotalCount = (count: number, limit: number) => {
        return Math.ceil(count / limit);
    }

    const onClickGetJobDetails = async (job: Job) => {
        setSelectedJob(job);
    }

    const startPage = Math.max(1, currentPage - 2);

    const endPage = Math.min(getTotalCount(searchReponse.data.count, limit), startPage + 4);

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
                                                <SelectItem key={key} value={`${propertyName}-asc`}>{propertyName}</SelectItem>
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
                                    className='h-8 w-[150px] lg:w-[250px]'
                                    placeholder="search..."
                                    onChange={(event) => onSearch(event)}
                                />
                            </div>
                            <div className="hidden sm:block">
                                <div className="flow-root">
                                    <div className="-mx-4 flex items-center divide-x divide-gray-200">
                                        <div className="px-4 relative inline-block text-left">
                                            <Select
                                                disabled={response.loading}
                                                onValueChange={onChangeLocation}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {response?.data?.locations && (response.data.locations as any[]).map((location, key) => (
                                                        <SelectItem key={key} value={location._id}>{location.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="px-4 relative inline-block text-left">
                                            <Select
                                                disabled={response.loading}
                                                onValueChange={onChangeCategory}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {response?.data?.categories && (response.data.categories as any[]).map((category, key) => (
                                                        <SelectItem key={key} value={category._id}>{category.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="px-4 relative inline-block text-left">
                                            <Select
                                                disabled={response.loading}
                                                onValueChange={onChangeJobType}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {response?.data.job_types && (response.data.job_types as any[]).map((type, key) => (
                                                        <SelectItem key={key} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                        </div>
                                        <div className="px-4 relative inline-block text-left">
                                            <Select
                                                disabled={response.loading}
                                                onValueChange={onChangeExperienceLevel}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Experience Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {response?.data.experience_level && (response.data.experience_level as any[]).map((el, key) => (
                                                        <SelectItem key={key} value={el}>{el}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="px-4 relative inline-block text-left">
                                            <Select
                                                disabled={response.loading}
                                                onValueChange={onChangeRemoteType}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Remote" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {response?.data.remote && (response.data.remote as any[]).map((remote, key) => (
                                                        <SelectItem key={key} value={remote}>{remote}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
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
                                    {Object.entries(filter).map(([key, value]) => (
                                        value && (
                                            <span key={key} className="m-1 inline-flex rounded-full border border-gray-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white text-gray-900">
                                                <span>{value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveFilter(key)}
                                                    className="flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                                >
                                                    <span className="sr-only">Remove filter for Objects</span>
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
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex flex-auto flex-col lg:flex-row">
                <div className="flex-none lg:flex flex-col w-full lg:w-2/5 xl:w-2/5 bg-gray-50">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200 min-h-0  overflow-y-auto">
                            {searchReponse?.data?.data && (searchReponse.data.data as any[]).map((job, key) => (
                                <li key={key} onClick={() => onClickGetJobDetails(job)}>
                                    <div className="block hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center px-4 py-4 sm:px-6">
                                            <div className="min-w-0 flex-1 flex items-start">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-12 w-12 rounded-full"
                                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                    <div>
                                                        <p className="text-xl font-medium text-balck">
                                                            {job.name}
                                                        </p>
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            <span>{job.location_name} ({job.remote})</span>
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
                            <li className='p-3'>
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
                    {selectedJob._id !== '' && (
                        <JobDetailsCard
                        job={jobReponse.data}
                        />
                    )}

                    {selectedJob._id == '' && (
                        <EmptyDetails />
                    )}
                </div>
            </div>
        </div>

    )
}