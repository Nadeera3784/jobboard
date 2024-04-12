import { useEffect, useState } from 'react';
import axios from 'axios';

export const TestPage = () => {

  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
    const search = {
      $regex: '',
      $options: 'i'
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
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>Test page {totalCount}</h2>

      {jobs && (jobs as any[]).map((job, key) => (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
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
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
        >
          &lt;&lt; First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
        >
          &lt; Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
        >
          Next &gt;
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
        >
          Last &gt;&gt;
        </button>
      </div>

    </div>
  )
}