import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

import { useGetFilters } from '../../hooks/Search/useGetFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Form/Select';
import { Input } from '../../components/Form/Input';

export const SearchPage = () => {

    const [jobs, setJobs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState({
        $regex: '',
        $options: 'i'
    });

    const { response, process } = useGetFilters();

    useEffect(() => {
        process();
    }, [response?.status]);

    useEffect(() => {
        const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';
        const endpoint = '/jobs';
        const filter = {
            category: { $regex: '' },
            location: { $regex: '' },
            remote: { $regex: '' },
            job_type: { $regex: '' },
            experience_level: { $regex: '' },
        };
        const order = {
            name: 1,
            category: 1,
            location: 1,
            remote: 1,
            job_type: 1,
            experience_level: 1
        };
        const limit = Number(2);
        const page = currentPage;
        const queryString = `?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(JSON.stringify(search))}&order=${encodeURIComponent(JSON.stringify(order))}&limit=${limit}&page=${page}`;
        const requestURL = `${API_BASE_URL}${endpoint}${queryString}`;
        axios.get(requestURL)
            .then(response => {
                setJobs(response.data.data.data);
                setTotalCount(response.data.data.count);

                const totalPages = Math.ceil(response.data.data.count / limit);
                setTotalPages(totalPages);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [currentPage, search]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
       setSearch({$regex: event.currentTarget.value, $options: 'i'})
    }
    
    return (
        <div className="flex flex-auto flex-col lg:flex-row max-w-full pt-16">
            <div className="flex-none lg:flex flex-col w-full lg:w-80 xl:w-96 p-4 lg:p-8 bg-gray-50">
                <div className='mb-5'>
                <Input
                    className='h-8 w-[150px] lg:w-[250px]'
                    placeholder="search..."
                    onChange={(event) => onSearch(event)}
                />
                </div>
                <div className='mb-5'>
                    <Select
                        disabled={response.loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Remote Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {response?.data.remote && (response.data.remote as any[]).map((remote, key) => (
                                <SelectItem key={key} value="admin">{remote}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-5'>
                    <Select
                        disabled={response.loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {response?.data.job_types && (response.data.job_types as any[]).map((type, key) => (
                                <SelectItem key={key} value="admin">{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-5'>
                    <Select
                        disabled={response.loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                            {response?.data.experience_level && (response.data.experience_level as any[]).map((el, key) => (
                                <SelectItem key={key} value="admin">{el}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-5'>
                    <Select
                        disabled={response.loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                            {response?.data?.locations && (response.data.locations as any[]).map((location, key) => (
                                <SelectItem key={key} value={location._id}>{location.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='mb-5'>
                    <Select
                        disabled={response.loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {response?.data?.categories && (response.data.categories as any[]).map((category, key) => (
                                <SelectItem key={key} value={category._id}>{category.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="flex-grow flex flex-col max-w-10xl mx-auto p-4 lg:p-8 w-full">
                {jobs && (jobs as any[]).map((job, key) => (
                    <div key={key} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="mb-4">
                            <div className="flex">
                                <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                                    P
                                </div>
                                <div className="text-gray-700 ml-5">
                                    <div className="font-bold text-xl mb-2">{job.name}</div>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                        UI/UX Designer
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                        Design Thinking
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                        Figma
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 text-base mt-4">
                                {job.description}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Full Time | Semarang | 50 applied | 5 days left
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
                    >
                        &lt;&lt; First
                    </button>
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
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
                    >
                        Last &gt;&gt;
                    </button>
                </div>
            </div>
        </div>

    )
}