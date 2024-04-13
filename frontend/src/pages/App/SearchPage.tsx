import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

import { useGetFilters } from '../../hooks/Search/useGetFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Form/Select';
import { Input } from '../../components/Form/Input';

type FilterState = {
    category: { $regex: string };
    location: { $regex: string };
    remote: { $regex: string };
    job_type: { $regex: string };
    experience_level: { $regex: string };
};


export const SearchPage = () => {

    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState({
        $regex: '',
        $options: 'i'
    });
    const [filter, setFilter] = useState<FilterState>({
        category: { $regex: '' },
        location: { $regex: '' },
        remote: { $regex: '' },
        job_type: { $regex: '' },
        experience_level: { $regex: '' },
    });
    const [appliedFilters, setAppliedFilters] = useState({});

    const { response, process } = useGetFilters();

    useEffect(() => {
        process();
    }, [response?.status]);

    useEffect(() => {
        const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';
        const endpoint = '/jobs';
        const order = {
            name: 1,
            category: 1,
            location: 1,
            remote: 1,
            job_type: 1,
            experience_level: 1
        };
        const limit = Number(5);
        const page = currentPage;
        const queryString = `?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(JSON.stringify(search))}&order=${encodeURIComponent(JSON.stringify(order))}&limit=${limit}&page=${page}`;
        const requestURL = `${API_BASE_URL}${endpoint}${queryString}`;
        axios.get(requestURL)
            .then(response => {
                setJobs(response.data.data.data);
                const totalPages = Math.ceil(response.data.data.count / limit);
                setTotalPages(totalPages);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [currentPage, search, filter]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ $regex: event.currentTarget.value, $options: 'i' })
    }

    const updateFilter = (filterKey: string, value: string) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            [filterKey]: { $regex: value }
        }));
        setAppliedFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: value
        }));
    };

    const onRemoveFilter = (filterKey: keyof FilterState) => {
        const { [filterKey]: removedFilter, ...rest } = appliedFilters as { [key: string]: string };
        setAppliedFilters(rest);
        setFilter(prevFilter => ({
            ...prevFilter,
            [filterKey]: { $regex: '' }
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
                                    <button
                                        type="button"
                                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                                        id="menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        Sort
                                        {/* Heroicon name: solid/chevron-down */}
                                        <svg
                                            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
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
                                        value.$regex && (
                                            <span key={key} className="m-1 inline-flex rounded-full border border-gray-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white text-gray-900">
                                                <span>{value.$regex}</span>
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
                <div className="flex-none lg:flex flex-col w-full lg:w-96 xl:w-96 bg-gray-50">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        Ricardo Cooper
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        {/* Heroicon name: solid/mail */}
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        <span className="truncate">ricardo.cooper@example.com</span>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            {/* Heroicon name: solid/chevron-right */}
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

                                </a>
                            </li>
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        Ricardo Cooper
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        {/* Heroicon name: solid/mail */}
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        <span className="truncate">ricardo.cooper@example.com</span>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            {/* Heroicon name: solid/chevron-right */}
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
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        Ricardo Cooper
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        {/* Heroicon name: solid/mail */}
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        <span className="truncate">ricardo.cooper@example.com</span>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            {/* Heroicon name: solid/chevron-right */}
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
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block hover:bg-gray-50">
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-12 w-12 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        Ricardo Cooper
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        {/* Heroicon name: solid/mail */}
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        <span className="truncate">ricardo.cooper@example.com</span>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            {/* Heroicon name: solid/chevron-right */}
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
                                </a>
                            </li>
                        </ul>
                        
                    </div>
                </div>
                <div className="flex-grow flex flex-col max-w-10xl mx-auto p-4 lg:p-8 w-full">
                    <ul role="list" className="divide-y divide-gray-200">
                        {jobs && (jobs as any[]).map((job, key) => (
                            <li key={key}>
                                <div className="hover:bg-gray-50  px-4 py-4 sm:px-6">
                                    <div className="flex p-3">
                                        <div className="mr-4">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {job.name}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {job.job_type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {/* Heroicon name: solid/users */}
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                        </svg>
                                                        Engineering
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        <svg
                                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {job.remote}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <svg
                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <p>
                                                        Closing on
                                                        <time dateTime="2020-01-07"> January 7, 2020</time>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>


                        ))}

                    </ul>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
                        >
                            &lt; Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => onPageChange(index + 1)}
                                className={`px-3 py-1 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}